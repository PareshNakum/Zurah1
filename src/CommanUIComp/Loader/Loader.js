import React from 'react'
import { Oval } from 'react-loader-spinner'

const Loader = () => {
    return (
        <>
            <section id="loader">
                <div className="loader">
                    <Oval
                        height={100}
                        width={100}
                        color="var(--bg-white)"
                        visible={true}
                        ariaLabel='oval-loading'
                        secondaryColor="var(--bg-white)"
                        strokeWidth={1}
                        strokeWidthSecondary={1}
                    />
                </div>
            </section>
        </>
    )
}

export default Loader;
