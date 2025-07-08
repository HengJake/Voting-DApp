import { Box, Button } from "@chakra-ui/react";
import React from "react";
import { FaVoteYea } from "react-icons/fa";
import { useContractStore } from "../store/contract.js";
import { useState, useEffect } from "react";
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

function Header() {
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

  const { registerCandidate, castVote } = useContractStore();

  const [candidate, setCandidate] = useState({
    eventId: "",
    name: "",
  });

  const [vote, setVote] = useState({
    eventId: "",
    name: "",
  });

  const handleVote = async () => { };

  const handleCandidate = async () => { };

  return (
    <Box
      width={"100%"}
      minH={"70px"}
      bg={"teal"}
      display={"flex"}
      justifyContent={"end"}
      alignItems={"center"}
      padding={3}
      gap={3}
    >
      
    </Box>
  );
}

export default Header;
