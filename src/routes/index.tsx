import { createFileRoute } from '@tanstack/react-router'
import { Grid, GridItem, Heading, Mark } from '@chakra-ui/react'
import FeaturedCharitiesSection from '@/components/FeaturedCharitiesSection'
import WhyDonateCryptoSection from '@/components/WhyDonateCryptoSection'
import WhyUsSection from '@/components/WhyUsSection'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {

  return (

    <Grid templateColumns="repeat(12, 1fr)" templateRows="auto" gapY="12">

      <GridItem colSpan={12}>
        <Heading textAlign="center">
          Donate Crypto.<br />
          <Mark variant="solid">Do Good.</Mark>
        </Heading>
      </GridItem>

      <GridItem colSpan={12} mt="12">
        <Heading textAlign="center" mb="6">Featured Charities</Heading>
        <FeaturedCharitiesSection />
      </GridItem>

      <GridItem colSpan={12}>
        <Heading textAlign="center" mb="4">Why Donate in Crypto?</Heading>
        <WhyDonateCryptoSection />
      </GridItem>

      <GridItem colSpan={12} mt={12}>
        <Heading textAlign="center" mb="4">Why Choose Us?</Heading>
        <WhyUsSection />
      </GridItem>

      <GridItem colSpan={12} mt={12}>

      </GridItem>

    </Grid>

  )
}
