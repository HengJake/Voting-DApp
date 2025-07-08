import { Box, Heading, Button, Text, Input, VStack, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useContractStore } from "../store/contract.js";
import HomeSidebar from "../component/homeSidebar.jsx";
import EventCard from "../component/eventCard.jsx";

function Home() {
  const [eventCandidates, setEventCandidates] = useState({});
  const { events, getAllEvent, getAllCandidates } = useContractStore();


  useEffect(() => { getAllEvent(); }, [getAllEvent]);

  useEffect(() => {
    // Fetch candidates for all events when events change
    async function fetchCandidates() {
      const candidatesMap = {};
      for (const event of events) {
        const candidates = await getAllCandidates(event.id, event.candidateCount);
        candidatesMap[event.id] = candidates;
      }
      setEventCandidates(candidatesMap);
    }
    if (events.length > 0) {
      fetchCandidates();
    }
  }, [events, getAllCandidates]);


  return (
    <Box textAlign="center" display={"flex"} height={"100%"}>
      <HomeSidebar />

      <Box flex={4}>
        <Heading mb={4}>Voting DApp</Heading>

        <SimpleGrid minChildWidth='120px' spacing='20px' margin={4}>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              candidates={eventCandidates[event.id] || []}
            />
          ))}
        </SimpleGrid>

      </Box>
    </Box>
  );
}

export default Home;
