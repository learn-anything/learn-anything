import React, { useRef, useState } from "react";
import {
  Stack,
  Flex,
  Heading,
  Input,
  Button,
  Tag,
  TagLabel,
  TagIcon,
} from "@chakra-ui/core";
import Container from "../components/Container";

const NewGuidePage = () => {
  const inputEl = useRef(null);
  const [state, setState] = useState({
    topics: [],
  });

  const addTopic = async () => {
    const input = inputEl.current.value;
    if (!(input == "")) {
      if (!state.topics.find((topic) => topic === input)) {
        setState({ topics: [...state.topics, input] });
      }
      inputEl.current.value = "";
    }
  };
  const removeTopic = async (e) => {
    setState({
      topics: state.topics.filter(
        (topic) => topic !== e.currentTarget.id.split("topic-")[1]
      ),
    });
  };

  return (
    <Container>
      <Stack
        justifyContent="center"
        alignItems="flex-start"
        m="0 auto 4rem auto"
        maxWidth="700px"
        w="100%"
      >
        <Flex
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          maxWidth="700px"
          w="100%"
        >
          <Heading letterSpacing="tight">Create a new guide</Heading>
          <Stack isInline mt={4} w="100%">
            <Input
              aria-label="Topics for guide"
              placeholder="Enter a topic"
              ref={inputEl}
              type="text"
            />
            <Button fontWeight="bold" size="md" onClick={addTopic}>
              Add
            </Button>
          </Stack>
          <Stack isInline flexWrap="wrap" mt={4}>
            {state.topics.map((topic) => (
              <Tag variant="outline" size="lg" mb={2}>
                <TagLabel>{topic}</TagLabel>
                <TagIcon id={`topic-${topic}`} icon="x" onClick={removeTopic} />
              </Tag>
            ))}
          </Stack>
        </Flex>
      </Stack>
    </Container>
  );
};

export default NewGuidePage;
