import type CharityCardProps from "@/types/CharityCardProps";
import { Badge, Box, Heading, HStack, Image, Progress, Text } from "@chakra-ui/react";

export default function CharityCard({ charityTitle, charityHost, charityCurrentDonation, charityTargetDonation, charityDescription, charityImage, charityCategory }: CharityCardProps) {

  const progress = charityCurrentDonation / charityTargetDonation
  const progressPercentage = Math.min(progress * 100, 100)

  return (
    <Box w="300px">
      <Box position="relative">
        <Image
          src="/Hutao.png"
          alt={charityImage.toString()}
          aspectRatio={4 / 3} />
        <Progress.Root minW="full" size="sm" striped animated value={progressPercentage}>
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      </Box>

      <HStack justify="space-between" fontSize="xs">
        <Badge variant="subtle" colorPalette="green">{charityCategory}</Badge>
        <Text>${charityCurrentDonation}/${charityTargetDonation}</Text>
      </HStack>

      <Box>
        <Heading fontWeight="bold">{charityTitle}</Heading>
        <Text fontSize="sm" color="darkgray">{charityHost}</Text>
        <Text mt="4">{charityDescription}</Text>
      </Box>
    </Box>
  )
}
