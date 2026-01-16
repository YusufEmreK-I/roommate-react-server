"use client"

import { TextField } from "@mui/material";

export default function Login() {

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <TextField 
        label="Yusuf" 
        className="yusuf" 
        id="yusuf"
        sx={{background:"white", color:"red"}}
      />
    </div>
    //sliderlı signup ve signin olsun
  );
}
