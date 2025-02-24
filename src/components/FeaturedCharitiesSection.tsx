import { Box, Flex } from "@chakra-ui/react";
import CharityCard from "./CharityCard";
import { data } from "./featuredData";

export default function FeaturedCharitiesSection() {
  const featuredCharities = data

  return (
    <Flex justify="space-between" overflowX="scroll" spaceX="6">
      {featuredCharities.map((feature) => (
        <Box key={feature.charityId}>
          <CharityCard {...feature} />
        </Box>
      ))}
    </Flex>
  )
}
