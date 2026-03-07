import BlurText from "@/components/BlurText.jsx";

export const Section = ({ title, subtitle, description, alignment = "left" }) => {
    return (
        <section className={`h-screen w-full flex flex-col justify-center p-12 md:p-24 ${alignment === "right" ? "items-end text-right" : "items-start text-left"} pointer-events-none`}>
            <div className="max-w-2xl">
                <BlurText
                    text={subtitle}
                    delay={30}
                    animateBy="letters"
                    direction="bottom"
                    className="text-orange-500 font-['Orbitron'] tracking-[0.3em] mb-4 uppercase text-sm font-bold"
                />
                <div className="mb-6">
                    <BlurText
                        text={title}
                        delay={50}
                        animateBy="words"
                        direction="bottom"
                        className="text-6xl md:text-8xl font-black text-white leading-none font-['Orbitron']"
                    />
                </div>
                <div className="text-gray-300 text-lg md:text-2xl max-w-md font-['Rajdhani'] font-medium leading-relaxed">
                    <BlurText
                        text={description}
                        delay={20}
                        animateBy="words"
                        direction="top"
                    />
                </div>
            </div>
        </section>
    );
};