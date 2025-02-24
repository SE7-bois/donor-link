import { Button, PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

export default function NavigationButton() {
  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Button variant="ghost">Navigation</Button>
      </PopoverTrigger>
      <PopoverContent position="absolute">
        <PopoverArrow />
        <PopoverBody>

          <VStack>

            <Button w="full" variant="ghost" _focus={{ fontWeight: "bold" }} asChild>
              <Link to="/">Home</Link>
            </Button>

            <Button w="full" variant="ghost" _focus={{ fontWeight: "bold" }} asChild>
              <Link to="/about">About</Link>
            </Button>

          </VStack>

        </PopoverBody>
      </PopoverContent>

    </PopoverRoot>
  )
}
