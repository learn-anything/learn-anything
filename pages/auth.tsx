import { Form } from "blade/components"

export default function Page() {
  return (
    <>
      <Form model="account">
        <input
          type="text"
          name="email"
          placeholder="Email"
          data-type="STRING"
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          data-type="STRING"
        />

        <button type="submit">Submit</button>
      </Form>
    </>
  )
}
