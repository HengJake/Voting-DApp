import React from "react";
import {
  Box,
  Heading,
  Button,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Toast } from "@chakra-ui/react";
import { FaVoteYea } from "react-icons/fa";
import { useContractStore } from "../store/contract.js";
import { FiUserPlus } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa";
import { TbBuildingCircus } from "react-icons/tb";
import {
  Modal,
  InputLeftElement,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  Input
} from '@chakra-ui/react';
import { useDisclosure } from "@chakra-ui/react";
import CountdownTimer from "./CountdownTimer.jsx";

function Sidebar() {
  const toast = useToast();
  const warningToastId = "empty-fields-toast";
  const successToastId = "event-created-toast";

  const { registerCandidate, castVote, events, setEvents, createEvent, getAllEvent } = useContractStore();

  const [coolDown, setCoolDown] = useState(false);
  const [coolDownTime, setCoolDownTime] = useState(0);

  useEffect(() => { getAllEvent(); }, [getAllEvent])

  // for new vote and candidate
  const {
    isOpen: isOpenCandidate,
    onOpen: onOpenCandidate,
    onClose: onCloseCandidate
  } = useDisclosure();

  const {
    isOpen: isOpenVote,
    onOpen: onOpenVote,
    onClose: onCloseVote
  } = useDisclosure();

  const [candidate, setCandidate] = useState({
    eventId: "",
    name: "",
  });

  const [vote, setVote] = useState({
    eventId: "",
    candidateId: "",
    candidateCount: 0
  });

  // for new event
  const [newEvent, setNewEvent] = useState({
    name: "",
    duration: "",
  });

  const handleClick = async (type) => {
    if (coolDown) return;


    if (type === "createE") {
      handleCreateEvent();
    } else if (type === "createCan") {
      handleCandidate();
    } else if (type === "createV") {
      handleVote();
    }

    setCoolDown(true);
    setCoolDownTime(5); // 5 seconds cooldown

    // Start countdown (optional, for showing time left)
    let seconds = 5;
    const interval = setInterval(() => {
      seconds -= 1;
      setCoolDownTime(seconds);
      if (seconds <= 0) {
        clearInterval(interval);
        setCoolDown(false);
        setCoolDownTime(0);
      }
    }, 1000);
  };

  const handleCreateEvent = async () => {
    if (!newEvent.name || !newEvent.duration) {
      if (!toast.isActive(warningToastId)) {
        toast({
          id: warningToastId,
          title: "Please fill in all fields.",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
      return;
    }

    if (newEvent.duration > 604800 || newEvent.duration < 0) {
      if (!toast.isActive(warningToastId)) {
        toast({
          id: warningToastId,
          title: "Invalid time duration 604800 is max",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
      return;
    }

    const res = await createEvent(newEvent.name, newEvent.duration);

    if (res.success) {
      if (!toast.isActive(successToastId)) {
        toast({
          id: successToastId,
          title: "New Event Created",
          description: `Name : ${newEvent.name}\nDuration : ${newEvent.duration}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        setNewEvent({ name: "", duration: "" });
      } else {
        toast({
          id: successToastId,
          title: "Action cancelled",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
      }
    }

    return;
  };

  const handleVote = async () => {
    if (!vote.candidateId) {
      if (!toast.isActive(warningToastId)) {
        toast({
          id: warningToastId,
          title: "Please fill in all fields.",
          status: "warning",
          duration: 2000,
          isClosable: true,
        })
      }
      return
    }

    console.log("🚀 ~ handleVote ~ vote:", vote)
    
    if (vote.candidateId > vote.candidateCount ) {
      if (!toast.isActive(warningToastId)) {
        toast({
          id: warningToastId,
          title: "Invalid Candidate ID",
          status: "warning",
          duration: 2000,
          isClosable: true,
        })
      }
      return
    }

    const res = await castVote(vote.eventId, vote.candidateId);

    if (!res.success) {
      toast({
        id: successToastId,
        title: "Action cancelled",
        description: res.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
      if (!toast.isActive(successToastId)) {
        toast({
          id: successToastId,
          title: "Vote Casted",
          description: `Event ID : ${vote.eventId}\n Candidate ID : ${vote.candidateId}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        onCloseVote();
        setVote({ eventId: "", candidateId: "" });
      }
    }
    return;

  };

  const handleCandidate = async () => {
    if (!candidate.name) {
      if (!toast.isActive(warningToastId)) {
        toast({
          id: warningToastId,
          title: "Please fill in all fields.",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
      return;
    }

    const res = await registerCandidate(candidate.eventId, candidate.name);

    if (!res.success) {
      toast({
        id: successToastId,
        title: "Action cancelled",
        description: res.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
      if (!toast.isActive(successToastId)) {
        toast({
          id: successToastId,
          title: "Candidate Register",
          description: `Name : ${candidate.name}\n EventID : ${candidate.eventId}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        onCloseCandidate();
        setCandidate({ name: "", eventId: "" });
      }
    }
    return;
  };



  useEffect(() => {
    getAllEvent();
  }, [getAllEvent]);

  return (
    <Box
      flex={1}
      bg={"teal"}
      display={"flex"}
      flexDir={"column"}
      justifyContent={"space-between"}
      height={"calc(100vh - 70px)"}
      minW={"270px"}
    >
      <Text mb={3} mt={3} color={"white"}>
        Ongoing Event
      </Text>
      <Box p={3} overflow={"auto"} border={"5px solid white"}>
        {events.length === 0 ? (
          <Text fontSize="sm" color="gray.200">
            No events found.
          </Text>
        ) : (
          events.map((event) => (
            <Box
              key={event.id}
              bg={event.ended ? "red.200" : "teal.200"}
              color="teal.900"
              p={3}
              mb={2}
              borderRadius="md"
              boxShadow="md"
              display={"flex"}
              justifyContent={"space-between"}
              pos={"relative"}
              overflow={"hidden"}
            >
              {
                event.ended ? (<Box bg="rgba(255,255,255,0.8)" w={"100%"} h={"100%"} pos={"absolute"} left={"0"} top={"0"}><Text pos={"absolute"} color={"black"} left={"50%"} top={"50%"} transform={"translate(-50%, -50%)"}>{event.winningCandidateId ? event.winningCandidateId : "No Winner"}</Text></Box>) : ""
              }

              <Box textAlign="left">
                <Text fontSize="xs" color="teal.700">
                  ID: {event.id}
                </Text>
                <Text fontWeight="bold" mb={3}>{event.title}</Text>
                <Text fontSize="xs" color={"red.800"} maxW={"100px"}>
                  <CountdownTimer endTime={Number(event.endTimeFormatted)} />
                </Text>
              </Box>
              <VStack align={"center"} justify={"center"}>
                <Button isDisabled={event.ended} bg={"teal"} color={"white"} onClick={() => {
                  setVote((prev) => ({ ...prev, eventId: event.id, candidateCount: event.candidateCount }))
                  onOpenVote();

                }}>
                  <FaVoteYea />
                </Button>
                <Button
                  isDisabled={event.ended}
                  bg={"transparent"} color={"teal"} onClick={() => {
                    setCandidate((prev) => ({ ...prev, eventId: event.id }))
                    onOpenCandidate();
                  }}>
                  <FiUserPlus />
                </Button>
              </VStack>
            </Box>
          ))
        )}
      </Box>

      <Box m={4} p={3} bg={"teal.100"} borderRadius={"xl"}>
        <VStack align={"start"}>
          <Text mb={3} fontSize={"xl"} color={"teal"} fontWeight={"700"}>
            Create Event
          </Text>
          <Input
            border={"2px solid teal"}
            placeholder="Title"
            size="md"
            value={newEvent.name}
            onChange={(e) => {
              setNewEvent((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
          />
          <Input
            border={"2px solid teal"}
            type="number"
            placeholder="Duration"
            size="md"
            value={newEvent.duration}
            onChange={(e) => {
              setNewEvent((prev) => ({
                ...prev,
                duration: e.target.value,
              }));
            }}
          />
          <Button
            bg={"teal"}
            color={"white"}
            onClick={() => handleClick("createE")}
            disabled={coolDown}
          >
            {coolDown && coolDownTime > 0 ? `Please wait ${coolDownTime}s` : "Create"}
          </Button>
        </VStack>
      </Box>

      {/*new candidate modal */}
      <Modal isOpen={isOpenCandidate} onClose={onCloseCandidate}>
        <ModalOverlay />
        <ModalContent bg={"teal.100"}>
          <ModalHeader>Candidate</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup mb={3}>
              <InputLeftElement pointerEvents='none'>
                <TbBuildingCircus color='gray.300' />
              </InputLeftElement>
              <Input type='number' placeholder='Event Id' borderColor={"teal"} value={candidate.eventId} readOnly />
            </InputGroup>
            <InputGroup>
              <InputLeftElement pointerEvents='none'>
                <FaUserTie color='gray.300' />
              </InputLeftElement>
              <Input type='text' placeholder='Name' borderColor={"teal"} value={candidate.name || ""} onChange={(e) => (setCandidate((prev) => ({ ...prev, name: e.target.value })))} />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='teal'
              mr={3}
              onClick={() => handleClick("createCan")}
              disabled={coolDown}
            >
              {coolDown && coolDownTime > 0 ? `Please wait ${coolDownTime}s` : "Create"}
            </Button>
            <Button variant='ghost' onClick={onCloseCandidate}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/*new vote modal */}
      <Modal isOpen={isOpenVote} onClose={onCloseVote}>
        <ModalOverlay />
        <ModalContent bg={"teal.100"}>
          <ModalHeader>Vote</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup mb={2}>
              <InputLeftElement pointerEvents='none'>
                <TbBuildingCircus color='gray.300' />
              </InputLeftElement>
              <Input type='tel' placeholder='Event Id' borderColor={"teal"} value={vote.eventId} readOnly />
            </InputGroup>
            <InputGroup>
              <InputLeftElement pointerEvents='none'>
                <FaUserTie color='gray.300' />
              </InputLeftElement>
              <Input type='number' placeholder='Candidate Id' borderColor={"teal"} value={vote.candidateId} onChange={(e) => { setVote((prev) => ({ ...prev, candidateId: e.target.value })) }} />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='teal'
              mr={3}
              onClick={() => handleClick("createV")}
              disabled={coolDown}
            >
              {coolDown && coolDownTime > 0 ? `Please wait ${coolDownTime}s` : "Vote"}
            </Button>
            <Button variant='ghost' onClick={onCloseVote}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Sidebar;
