'use client'
import ViewerBody from '../Component/viewer_body'



export default function Watch() {

    return (
        <>
            <div style={{resize: "none"}}>
                <ViewerBody />
            </div>
            <div className='flex flex-col w-full'>
            </div>
        </>
    )
}