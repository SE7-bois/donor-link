import { Link, Outlet, createRootRoute, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Box, Button, Container, Flex, Heading, HStack, IconButton, List, PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTitle, PopoverTrigger, Separator, Text, VStack } from '@chakra-ui/react'
import { useColorMode } from '@/components/ui/color-mode'
import { LuSun, LuMoon } from 'react-icons/lu'
import NavigationButton from '@/components/NavigationButton'
import StartDonatingButton from '@/components/StartDonatingButton'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <div>404 Not Found</div>
})

function RootComponent() {

  const { toggleColorMode, colorMode } = useColorMode()

  return (
    <>
      <Box minW='100%' colorPalette="white" bg="white" _dark={{ bg: "black" }} position="fixed" p="2" borderBottomWidth="1px" borderBottomColor="darkgray" zIndex="max" top="0" left="0">
        <Flex justifyContent="space-between" h="full">
          <Box>
            <Button variant="plain" fontWeight='bold' fontSize="2xl" onClick={() => window.scrollTo({ top: 0 })}>Charity Wave</Button>
          </Box>
          <Box>
            <IconButton onClick={toggleColorMode} variant="ghost" size="sm">
              {colorMode === "light" ? <LuSun /> : <LuMoon />}
            </IconButton>

            <NavigationButton />
            <StartDonatingButton />
            <Button variant="ghost">Start a Fundraiser</Button>


            <PopoverRoot lazyMount unmountOnExit>
              <PopoverTrigger asChild>
                <Button variant="solid" colorPalette="purple">Connect Wallet</Button>
              </PopoverTrigger>
              <PopoverContent position="absolute" right="0">
                <PopoverBody>

                  <VStack>
                    <Button variant="ghost" w="full" _focus={{ fontWeight: "bold" }} asChild>
                      <Text>
                        Wallet 1 test
                      </Text>
                    </Button>
                    <Button variant="ghost" w="full" _focus={{ fontWeight: "bold" }} asChild>
                      <Text>
                        Wallet 2 test
                      </Text>
                    </Button>
                  </VStack>

                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>

          </Box>
        </Flex>
      </Box>
      <Container mt="72px" minW='4/5'>
        <Outlet />
      </Container>
      <TanStackRouterDevtools position='bottom-right' />
    </>

  )
}
