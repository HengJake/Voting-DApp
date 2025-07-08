import VotingDAppABI from "../../../artifacts/contracts/VotingDApp.sol/VotingDApp.json";
import { ethers } from "ethers";
import { create } from "zustand";

const contractAddr =
  import.meta.env.VITE_CONTRACT_ADDR ||
  "0xEe73098C2a73937C8e4906F17ad108Fc9A7f901b";

async function getContract() {
  const providerObj = window.ethereum;
  if (!providerObj) {
    alert(
      "No Ethereum-compatible wallet found. Please install KAIA Wallet or MetaMask."
    );
    throw new Error("No wallet found");
  }
  await providerObj.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(providerObj);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddr, VotingDAppABI.abi, signer);
}

export const useContractStore = create((set) => ({
  events: [],
  setEvents: (events) => set({ events }),

  fetchEventCount: async (setEventCount) => {
    const contract = await getContract();
    const count = await contract.votingEventCount();
    setEventCount(count.toString());
  },

  createEvent: async (title, duration) => {
    try {
      const contract = await getContract();
      const tx = await contract.createVotingEvent(title, duration);
      await tx.wait();

      const count = await contract.votingEventCount();
      const latestEvent = await contract.votingEvents(count);

      set((state) => ({
        events: [latestEvent, ...state.events], // Add newest event to the front
      }));
      return {
        success: true,
        message: "Event created successfully",
        data: tx.hash,
      };
    } catch (error) {
      console.error(error);
      return { success: true, message: error.message, data: null };
    }
  },

  registerCandidate: async (eventId, name) => {
    try {
      const contract = await getContract();
      const tx = await contract.registerCandidate(eventId, name);
      await tx.wait();
      return {
        success: true,
        message: "Candidate registered successfully",
        data: tx.hash,
      };
    } catch (error) {
      // Try to extract the revert reason from different possible locations
      let message = "Unknown error";
      if (error?.error?.data?.message) {
        message = error.error.data.message;
      } else if (error?.data?.message) {
        message = error.data.message;
      } else if (error?.reason) {
        message = error.reason;
      } else if (error?.message) {
        message = error.message;
      }
      // Optionally, you can also try to parse the revert reason from the data
      // (for advanced cases, see below)
      return { success: false, message, data: null };
    }
  },

  getAllEvent: async () => {
    const contract = await getContract();
    const count = await contract.votingEventCount();
    const events = [];
    const now = Math.floor(Date.now() / 1000);

    for (let i = 1; i <= Number(count); i++) {
      const eventDetail = await contract.votingEvents(i);
      const endTime = Number(eventDetail.endTime);

      events.push({
        id: eventDetail.id?.toString(),
        title: eventDetail.title,
        endTimeFormatted: Number(eventDetail.endTime),
        endTime: eventDetail.endTime
          ? new Date(Number(eventDetail.endTime) * 1000).toLocaleString()
          : "",
        candidateCount: eventDetail.candidateCount?.toString(),
        ended: now >= endTime,
        winnerId: eventDetail.winnerId?.toString(),
      });
    }
    set({ events });
    return events;
  },

  castVote: async (eventId, candidateId) => {
    try {
      const contract = await getContract();
      const tx = await contract.vote(eventId, candidateId);
      await tx.wait();
      return { success: true, hash: tx.hash };
    } catch (error) {

      return { success: false };
    }
  },

  getWinner: async (eventId) => {
    try {
      const contract = await getContract();
      // getWinner is not a view function, so it may cost gas
      const winnerName = await contract.getWinner(eventId);
      return { success: true, winnerName };
    } catch (error) {
      let message = error?.reason || error?.message || "Unknown error";
      return { success: false, message };
    }
  },

  viewWinner: async (eventId) => {
    try {
      const contract = await getContract();
      const winnerName = await contract.viewWinner(eventId);
      return { success: true, winnerName };
    } catch (error) {
      let message = error?.reason || error?.message || "Unknown error";
      return { success: false, message };
    }
  },

  getCurrentTime: async () => {
    try {
      const contract = await getContract();
      const currentTime = await contract.getCurrentTime();
      return Number(currentTime);
    } catch (error) {
      let message = error?.reason || error?.message || "Unknown error";
      return { success: false, message };
    }
  },

  getVotingEventEndTime: async (eventId) => {
    try {
      const contract = await getContract();
      const endTime = await contract.getVotingEventEndTime(eventId);
      return Number(endTime);
    } catch (error) {
      let message = error?.reason || error?.message || "Unknown error";
      return { success: false, message };
    }
  },

  getAllCandidates: async (eventId, candidateCount) => {
    const contract = await getContract();
    const candidates = [];
    for (let i = 1; i <= Number(candidateCount); i++) {
      try {
        const [id, name, voteCount] = await contract.getCandidate(eventId, i);
        candidates.push({
          id: id.toString(),
          name,
          voteCount: voteCount.toString(),
        });
      } catch (error) {
        // Optionally handle error
        console.error(`Error fetching candidate ${i} for event ${eventId}:`, error);
      }
    }
    return candidates;
  },
}));
