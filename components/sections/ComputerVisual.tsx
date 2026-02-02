import Scene from "../Scene";

export default function ComputerVisual() {
  return <main className="fixed z-20 bottom-20 left-[50%] -translate-x-[50%]">
        <section style={{ height: '100px' }}>
          <Scene />
        </section>
      </main>
}