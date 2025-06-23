import io from "socket.io-client"

const createSocket=()=>{
     return io("http://localhost:3000", {
    withCredentials: true,
  });
}

export default createSocket;