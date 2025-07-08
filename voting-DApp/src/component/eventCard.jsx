import React from 'react'
import { Box, HStack, VStack } from '@chakra-ui/react'
import { Image, Text, Card, CardHeader, CardBody, CardFooter, Stack, Heading, Divider, ButtonGroup, Button } from '@chakra-ui/react'
import CountdownTimer from './CountdownTimer';

function EventCard({ event, candidates }) {

  const bgColor = event.ended ? "linear(to-r, red.300, red.200)" : "linear(to-r, teal.400, teal.300)";

  return (
    <Card
      maxW={{ base: "100%", sm: "sm" }}
      w="100%"
      textAlign="left"
      borderRadius="lg"
      boxShadow="md"
    >
      <CardBody bgGradient={bgColor} w={"100%"} overflow={"hidden"}>
        <HStack
          align="center"
          justify="space-between"
          mb={3}
          flexDirection={{ base: "column", sm: "row" }}
          spacing={{ base: 2, sm: 4 }}
        >
          <Heading fontSize={{ base: "md", md: "20px" }}>{event.title}</Heading>
          <Box borderRadius="20px"
            bg="white"
            p={2}
            border="1px solid"
            maxW="90px"
            maxH="40px"
            overflow={"hidden"}
            textAlign="center"
          >
            <CountdownTimer endTime={Number(event.endTimeFormatted)} />
          </Box>
        </HStack>
        <Box>
          <Text fontSize={"15px"}>{event.endTime}</Text>
        </Box>
      </CardBody>
      <Divider />
      <CardFooter flexDir={"column"}>

        <HStack align={"center"} justify={"space-between"} w={"100%"} borderBottom={"1px solid"}>
          <Heading fontSize={"15px"}>Candidate</Heading>
          <Text>{event.candidateCount}</Text>
        </HStack>

        <VStack flex={1} align={"start"}>
          {candidates.map((candidate) => (
            <Text key={candidate.id} wordBreak={"break-word"}>
              {candidate.name} (Votes: {candidate.voteCount})
            </Text>
          ))}
        </VStack>



      </CardFooter>
    </Card>
  )
}

export default EventCard