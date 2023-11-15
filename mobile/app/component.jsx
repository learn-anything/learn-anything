export const Component = (props) => {
  const { count } = props;
  return (
    <button
      style={{
        color: 'green',
      }}
      text={`You have tapped ${count()} time${count() === 1 ? '' : 's'}`}
      on:tap={() => {
        alert(`You have tapped ${count()} time${count() === 1 ? '' : 's'}`);
      }}
    />
  );
};
