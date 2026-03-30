import React from 'react'
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Layout from './Layout/Layout'

function NotFound() {
  return (
    <Layout>
      <div className="notFountContainer">
         <DotLottieReact src="/Looped 404 error animation.json" autoplay loop />
      </div>
    </Layout>
  )
}
export default NotFound