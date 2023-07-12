import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const { data, error, isLoading } = useSWR<any>('/api/user', fetcher)

  // const getData = async () => {
  //   const user = await fetch('/api/user');
  //   console.log('user:', user);
  // }

  // getData()

  return (
    <div>
      Hello World
      <span>
      { JSON.stringify(data) }
      </span>
    </div>
  )
}
