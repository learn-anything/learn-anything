/** @jsx jsx */
import { jsx, Styled } from "theme-ui";
import { FunctionComponent } from "react";
// import { Editor } from '@blocks/editor'

const NewGuidePage: FunctionComponent = () => {
  return (
    <div
      sx={{
        maxWidth: 1024,
        mx: "auto",
        p: 3
      }}
    >
      <title>New Guide</title>
      <Styled.h2 sx={{ textDecoration: "underline" }}>
        Create a new study guide
      </Styled.h2>
      <select>
        <option value="">Choose one</option>
      </select>
      {/* <Editor
                initialValue=""
                onChange={{}}
                components={{}}
            /> */}
    </div>
  );
};

export default NewGuidePage;
