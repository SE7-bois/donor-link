import { Box, Flex, Icon, Text, VStack } from "@chakra-ui/react"
import { data } from "./usData"
import { LuStar } from "react-icons/lu"

export default function WhyUsSection() {
  const reasons = data
  return (
    <VStack w="1/3" mx="auto" spaceY="4">
      {reasons.map((reason) => (
        <Flex w="full" gapX="2">
          <Box alignSelf="center">
            <Icon>
              <LuStar size={42} />
            </Icon>
          </Box>
          <Box flexDir="column">
            <Text fontWeight="bold">{reason.heading}</Text>
            <Text>{reason.text}</Text>
          </Box>
        </Flex>
      ))}
    </VStack>
  )
}
