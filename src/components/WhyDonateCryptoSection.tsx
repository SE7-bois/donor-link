import { Box, Flex, Grid, GridItem, Icon, Text } from "@chakra-ui/react";
import { data } from "./reasonData";
import { LuStar } from "react-icons/lu";

export default function WhyDonateCryptoSection() {

  const reasons = data

  return (
    <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(3, 1fr)" placeItems="center" gap="4">
      {reasons.map((reason) => (
        <GridItem w="full" h="full">
          <Flex gapX="2">
            <Box alignSelf="center">
              <Icon>
                <LuStar size={42} />
              </Icon>
            </Box>
            <Box flexDir="row">
              <Text fontWeight="bold">{reason.heading}</Text>
              <Text>{reason.text}</Text>
            </Box>
          </Flex>
        </GridItem>
      ))}
    </Grid>
  )
}
