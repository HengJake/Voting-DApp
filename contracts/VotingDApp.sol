// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingDApp {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool voted;
        uint256 candidateId;
    }

    struct VotingEvent {
        uint256 id;
        string title;
        uint256 endTime;
        mapping(uint256 => Candidate) candidates;
        uint256 candidateCount;
        mapping(address => Voter) voters;
        bool winnerDeclared;
        uint256 winningCandidateId;
    }

    // keep track of all the voting event
    mapping(uint256 => VotingEvent) public votingEvents;
    uint256 public votingEventCount;

    // === Create a new voting event ===
    function createVotingEvent(string memory _title, uint256 _durationInSeconds)
        public
    {
        votingEventCount++;
        VotingEvent storage ve = votingEvents[votingEventCount];
        ve.id = votingEventCount;
        ve.title = _title;
        ve.endTime = block.timestamp + _durationInSeconds;
    }

    // === Register candidate to event ===
    function registerCandidate(uint256 _eventId, string memory _name) public {
        VotingEvent storage ve = votingEvents[_eventId];
        require(block.timestamp < ve.endTime, "Voting ended");
        ve.candidateCount++;
        ve.candidates[ve.candidateCount] = Candidate(
            ve.candidateCount,
            _name,
            0
        );
    }

    // === Vote for a candidate ===
    function vote(uint256 _eventId, uint256 _candidateId) public {
        VotingEvent storage ve = votingEvents[_eventId];
        require(block.timestamp < ve.endTime, "Voting ended");
        require(!ve.voters[msg.sender].voted, "Already voted");
        require(_candidateId <= ve.candidateCount, "Invalid candidate");

        ve.voters[msg.sender] = Voter(true, _candidateId);
        ve.candidates[_candidateId].voteCount++;
    }

    // === Get winner after end time ===
    function getWinner(uint256 _eventId)
        public
        returns (string memory winnerName)
    {
        VotingEvent storage ve = votingEvents[_eventId];
        require(block.timestamp >= ve.endTime, "Voting not yet ended");
        require(!ve.winnerDeclared, "Winner already declared");

        uint256 winningVoteCount = 0;
        uint256 winnerId = 0;

        for (uint256 i = 1; i <= ve.candidateCount; i++) {
            if (ve.candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = ve.candidates[i].voteCount;
                winnerId = i;
            }
        }

        ve.winnerDeclared = true;
        ve.winningCandidateId = winnerId;
        return ve.candidates[winnerId].name;
    }

    // === View winner if declared ===
    function viewWinner(uint256 _eventId) public view returns (string memory) {
        VotingEvent storage ve = votingEvents[_eventId];
        require(ve.winnerDeclared, "Winner not declared");
        return ve.candidates[ve.winningCandidateId].name;
    }

    // debug
    // View current block timestamp (now)
    function getCurrentTime() public view returns (uint256) {
        return block.timestamp;
    }

    // View the end time of a voting event
    function getVotingEventEndTime(uint256 _eventId)
        public
        view
        returns (uint256)
    {
        return votingEvents[_eventId].endTime;
    }
}
