import { onMount } from 'solid-js';
import { useParams } from '~/router';

export const Note = () => {
  const params = useParams<'Notes'>();
  onMount(() => {
    console.log(params, 'hiiii');
  });
  return (
    <>
      <stacklayout>
        <sw:SwiftUI swiftId="testView" height="100" />
      </stacklayout>
    </>
  );
};
