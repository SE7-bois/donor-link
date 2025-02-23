import type CharityCardProps from "@/types/CharityCardProps";
import { Box, Float, Heading, Image, Mark, Progress, Text } from "@chakra-ui/react";

export default function CharityCard({ charityTitle, charityHost, charityCurrentDonation, charityTargetDonation, charityDescription, charityImage, charityCategory }: CharityCardProps) {

  const progress = charityCurrentDonation / charityTargetDonation
  const progressPercentage = Math.min(progress * 100, 100)

  return (
    <Box w="300px">
      <Box width="300px" position="relative">
        <Image src="/Hutao.png" htmlWidth="300px" alt={charityImage.toString()} aspectRatio={4 / 3} />
        <Float placement="top-start" offsetX="11" offsetY="5" zIndex={10}><Mark variant="subtle" rounded="xl" p="1">{charityCategory}</Mark></Float>
        <Float placement="bottom-start" offsetX="10" offsetY="6" zIndex={10}><Mark variant="subtle" rounded="lg" p="0.5">${charityCurrentDonation}/${charityTargetDonation}</Mark></Float>
        <Progress.Root minW="full" size="sm" striped animated value={progressPercentage}>
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      </Box>

      <Box>
        <Heading>{charityTitle}</Heading>
        <Text>{charityHost}</Text>
        <Text>{charityDescription}</Text>
      </Box>
    </Box>
  )
}
