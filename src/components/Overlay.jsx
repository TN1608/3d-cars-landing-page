import BlurText from "@/components/BlurText.jsx";

export const Overlay = () => {
    return (
        <div className="w-screen">
            {/* Section 1: Hero */}
            <section className="h-screen flex items-center p-20">
                <div className="max-w-md">
                    <h1 className="text-8xl font-black text-white">MCLAREN GT3</h1>
                    <p className="text-blue-500 font-mono italic">PRECISION ENGINEERED</p>
                </div>
            </section>

            {/* Section 2: Cánh xe */}
            <section className="h-screen flex items-center justify-end p-20">
                <div className="bg-black/40 backdrop-blur-md p-8 border-r-4 border-blue-600">
                    <BlurText
                        text={"AERODYNAMICS"}
                        delay={150}
                        animateBy={"words"}
                        direction={"top"}
                        className={"text-4xl font-bold text-accent"}/>
                    <BlurText
                        text="The McLaren GT3's aerodynamic design is a masterpiece of engineering, featuring a sleek body that minimizes drag and maximizes downforce. Every curve and vent is meticulously crafted to ensure optimal performance on the track, allowing the car to maintain stability at high speeds and navigate corners with precision."
                        delay={200}
                        animateBy="words"
                        direction="top"
                        className="text-2xl mb-8"
                    />
                </div>
            </section>

            {/*Section 3: Bánh xe*/}
            <section className="h-screen flex items-center justify-end p-20">
                <div className="bg-black/40 backdrop-blur-md p-8 border-r-4 border-blue-600">
                    <BlurText
                        text={"WHEELSET"}
                        delay={150}
                        animateBy={"words"}
                        direction={"top"}
                        className={"text-4xl font-bold text-accent"}
                    />
                    <BlurText
                        text="Carbon-forged wheels engineered for lightweight performance and maximum grip."
                        delay={200}
                        animateBy="words"
                        direction="top"
                        className="text-2xl mb-8"
                    />
                </div>
            </section>

            {/*    Section 4: cánh xe */}
            <section className="h-screen flex items-center justify-end p-20">
                <div className="bg-black/40 backdrop-blur-md p-8 border-r-4 border-blue-600">
                    <BlurText
                        text={"REAR WING"}
                        delay={150}
                        animateBy={"words"}
                        direction={"top"}
                        className={"text-4xl font-bold text-accent"}
                    />
                    <BlurText
                        text="The rear wing of the McLaren GT3 is a critical component that generates downforce, enhancing the car's grip and stability at high speeds. Its adjustable design allows for fine-tuning to suit different track conditions, ensuring optimal performance and cornering capabilities."
                        delay={200}
                        animateBy="words"
                        direction="top"
                        className="text-2xl mb-8"
                    />
                </div>
            </section>

            {/*Section 5: Đầu xe & Tổng thể - Khi den dau xe se chay tieng dong co xe*/}
            <section className="h-screen flex items-center justify-end p-20">
                <div className="bg-black/40 backdrop-blur-md p-8 border-r-4 border-blue-600">
                    <BlurText
                        text={"DESIGN & PERFORMANCE"}
                        delay={150}
                        animateBy={"words"}
                        direction={"top"}
                        className={"text-4xl font-bold text-accent"}
                    />
                    <BlurText
                        text="The McLaren GT3's design is a harmonious blend of form and function, with a focus on aerodynamic efficiency and aggressive styling. Its lightweight construction, powerful engine, and advanced suspension system work together to deliver exhilarating performance on the track, making it a true contender in the world of GT racing."
                        delay={200}
                        animateBy="words"
                        direction="top"
                        className="text-2xl mb-8"
                    />
                </div>
            </section>
        </div>
    )
}