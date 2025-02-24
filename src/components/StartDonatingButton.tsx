import { Button, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

export default function StartDonatingButton() {
  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Button variant="ghost">Start Donating</Button>
      </PopoverTrigger>
      <PopoverContent position="absolute">
        <PopoverBody>

          <VStack>

            <Button w="full" variant="ghost" _focus={{ fontWeight: "bold" }} asChild>
              <Link to="/">Btn 1</Link>
            </Button>

            <Button w="full" variant="ghost" _focus={{ fontWeight: "bold" }} asChild>
              <Link to="/">Btn 2</Link>
            </Button>

          </VStack>

        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  )
}
