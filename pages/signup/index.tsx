import { type FormEvent, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function SignUpPage() {
  const supabaseClient = useSupabaseClient();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setMessage("");
      setLoading(true);
      const formData = Object.fromEntries(new FormData(e.currentTarget));
      const { email, username, password } = formData;

      if (
        typeof email !== "string" ||
        typeof username !== "string" ||
        typeof password !== "string"
      )
        throw Error("Form is not valid");

      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (error) throw Error(error.message);

      setLoading(false);

      setMessage("User created.");
    } catch (e) {
      setLoading(false);
      if (e instanceof Error) {
        setMessage(e.message);
      }
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input type="text" name="username" />
        </label>
        <label>
          Email
          <input type="email" name="email" />
        </label>
        <label>
          Password
          <input type="password" name="password" />
        </label>
        <button type="submit" aria-busy={loading}>
          Sign up
        </button>
        {message && <small>{message}</small>}
      </form>
    </main>
  );
}
