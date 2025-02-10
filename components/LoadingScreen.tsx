import { Spinner } from "@heroui/spinner"

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex h-screen w-screen flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p>Loading...</p>
    </div>
  )
}
