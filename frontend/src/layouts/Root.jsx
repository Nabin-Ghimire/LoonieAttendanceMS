import { Outlet } from "react-router-dom"

//-->Making folder structure and route model-->


// const getSelf = async () => {
//   const { data } = await self();
//   return data;
// }
const Root = () => {
  // const { setUser } = userAuthStore();

  // const { data, isLoading } = useQuery({
  //   queryKey: ['self'],
  //   queryFn: getSelf,
  //   retry: (failureCount, error) => {
  //     if (error instanceof AxiosError && error.response?.status === 401) {
  //       //if the error is 401, we don't want to retry the request
  //       return false;
  //     }
  //     return failureCount < 3;
  //   }
  // });

  // useEffect(() => {
  //   if (data) {
  //     setUser(data);
  //   }
  //   console.log(data)
  // }, [data, setUser]);

  // if (isLoading) {
  //   return <div>Loading...</div>
  // }
  return <Outlet />
}

export default Root