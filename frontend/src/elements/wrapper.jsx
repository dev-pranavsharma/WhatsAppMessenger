import React from 'react'

const Wrapper = ({error,loading,Skeleton,children,className}) => {
  return (
        <section className={className}>
        {loading ? 
        <Skeleton/> : 
        children?children:
        error
        }
        </section>
  )
}

export default Wrapper