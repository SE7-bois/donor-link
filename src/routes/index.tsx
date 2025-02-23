import { createFileRoute } from '@tanstack/react-router'
import { Box, Flex, Grid, GridItem, Heading, Highlight, Icon, Mark, Text, VStack } from '@chakra-ui/react'
import CharityCard from '@/components/CharityCard'
import type CharityCardProps from '@/types/CharityCardProps'
import { LuStar } from 'react-icons/lu'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {

  const data: CharityCardProps = {
    charityCategory: "Education",
    charityHost: "MonaKecil",
    charityTitle: "Fight AI",
    charityImage: new URL("https://www.cloud.google.com/bucket/4214"),
    charityDescription: "Lorem lalalalalaaaaaaaalalaksdjflkadsj;fladjsl;fkajdslfkj;adsjf;akdsjf",
    charityTargetDonation: 350,
    charityCurrentDonation: 50
  }

  return (

    <Grid templateColumns="repeat(12, 1fr)" templateRows="auto" gapY="12">

      <GridItem colSpan={12}>
        <Heading textAlign="center">
          Donate Crypto.<br />
          <Mark variant="solid">Do Good.</Mark>
        </Heading>
      </GridItem>

      <GridItem colSpan={12} mt="12">
        <Heading textAlign="center">
          Featured Charities
        </Heading>
      </GridItem>

      <GridItem colSpan={12}>
        <Flex justify="space-between" overflowX="scroll" spaceX="6">

          <Box>
            <CharityCard charityImage={data.charityImage} charityDescription={data.charityDescription} charityCategory={data.charityCategory} charityTargetDonation={data.charityTargetDonation} charityCurrentDonation={data.charityCurrentDonation} charityHost={data.charityHost} charityTitle={data.charityTitle} />
          </Box>

          <Box>
            <CharityCard charityImage={data.charityImage} charityDescription={data.charityDescription} charityCategory={data.charityCategory} charityTargetDonation={data.charityTargetDonation} charityCurrentDonation={data.charityCurrentDonation} charityHost={data.charityHost} charityTitle={data.charityTitle} />
          </Box>

          <Box>
            <CharityCard charityImage={data.charityImage} charityDescription={data.charityDescription} charityCategory={data.charityCategory} charityTargetDonation={data.charityTargetDonation} charityCurrentDonation={data.charityCurrentDonation} charityHost={data.charityHost} charityTitle={data.charityTitle} />
          </Box>

          <Box>
            <CharityCard charityImage={data.charityImage} charityDescription={data.charityDescription} charityCategory={data.charityCategory} charityTargetDonation={data.charityTargetDonation} charityCurrentDonation={data.charityCurrentDonation} charityHost={data.charityHost} charityTitle={data.charityTitle} />
          </Box>

          <Box>
            <CharityCard charityImage={data.charityImage} charityDescription={data.charityDescription} charityCategory={data.charityCategory} charityTargetDonation={data.charityTargetDonation} charityCurrentDonation={data.charityCurrentDonation} charityHost={data.charityHost} charityTitle={data.charityTitle} />
          </Box>

        </Flex>
      </GridItem>

      <GridItem colSpan={12} mt="12">
        <Heading textAlign="center">Why Donate in Crypto?</Heading>
        <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(3, 1fr)" placeItems="center">

          <GridItem>
            <Flex>
              <Box alignSelf="center">
                <Icon>
                  <LuStar size={42} />
                </Icon>
              </Box>
              <Box flexDir="row">
                <Text>Hello</Text>
                <Text>Yow!</Text>
              </Box>
            </Flex>
          </GridItem>

          <GridItem>
            <Icon>
              <LuStar />
            </Icon>
          </GridItem>

        </Grid>
      </GridItem>

    </Grid>

  )
}
