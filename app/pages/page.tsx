export default function Home() {

  const getData = async () => {
    const user = await fetch('/api/user');
    console.log('user:', user);
  }

  getData()

  return (
    <div>Hello World</div>
  )
}
