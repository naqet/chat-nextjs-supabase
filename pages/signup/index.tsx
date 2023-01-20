import { type FormEvent, useState } from "react";
import useTypedSbClient from "@/utils/useTypedSbClient";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const supabaseClient = useTypedSbClient();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError("");
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
      router.push("/login");
    } catch (e) {
      setLoading(false);
      if (e instanceof Error) {
        setError(e.message);
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
        <Link href="login">Login</Link>
        {error && (
          <p>
            <small>{error}</small>
          </p>
        )}
      </form>
    </main>
  );
}
