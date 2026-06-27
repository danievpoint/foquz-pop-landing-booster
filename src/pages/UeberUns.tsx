import Navbar from "@/components/Navbar";
import MarqueeBanner from "@/components/MarqueeBanner";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const UeberUns = () => (
  <div className="min-h-screen">
    <SeoHead title={"Über uns – FOQUZ"} description={"Die FOQUZ Brand Story: Wie zwei Musikproduzenten aus einer asiatischen Kräuterdose die Original Riechdose entwickelt haben."} path={"/ueber-uns"} />
      <MarqueeBanner />
    <Navbar />
    <div className="container mx-auto px-4 pt-44 md:pt-56 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Unsere Geschichte</h1>
      <div className="prose prose-lg max-w-none opacity-80 space-y-6 leading-relaxed [&_p]:leading-[1.45]">
        <p>Manchmal reicht eine einzige Entdeckung, um eine neue Idee entstehen zu lassen.</p>
        <p>Wir sind Kevin Zaremba und Matthias Kurpiers – Produzenten und Songwriter. Seit über zehn Jahren verbringen wir den Großteil unseres Lebens im Studio. Gemeinsam durften wir zahlreiche Gold- und Platin-Auszeichnungen feiern und an Songs mitwirken, die weltweit Milliarden Streams erreicht haben.</p>
        <p>Unser Alltag besteht aus langen Arbeitstagen, kreativen Nächten und ständigem Fokus.</p>
        <p>Während unserer Weltreise durch Thailand und viele weitere Länder Asiens sind wir auf ein Produkt gestoßen, das dort fast jeder kennt: eine traditionelle Kräuterdose. Anfangs war sie nur ein Souvenir. Wenige Tage später war sie aus unserem Alltag nicht mehr wegzudenken – im Studio, auf Reisen oder einfach immer dann, wenn wir einen kleinen Frischekick brauchten.</p>
        <p>Zurück in Deutschland hat uns genau dieses Gefühl gefehlt.</p>
        <p>Also beschlossen wir, unsere eigene Version zu entwickeln. Nicht als Kopie, sondern als moderne Interpretation – mit hochwertigen Inhaltsstoffen, einem klaren Design und einer Qualität, hinter der wir selbst zu 100 % stehen.</p>
        <p>So entstand FOQUZ.</p>
        <p>Nach Jahren in der Musik war das unsere erste Unternehmung außerhalb des Studios. Ein komplett neues Projekt, in das wir denselben Anspruch gesteckt haben, der uns auch in der Musik begleitet: keine halben Sachen.</p>
        <p>FOQUZ ist das Ergebnis einer Reise, unzähliger Ideen und dem Wunsch, etwas zu entwickeln, das wir selbst jeden Tag benutzen.</p>
        <p>Wir hoffen, dass FOQUZ auch dein täglicher Begleiter wird – egal ob im Büro, beim Sport, unterwegs oder genau dann, wenn du einen klaren Kopf brauchst.</p>
        <p>Von zwei Produzenten. Inspiriert von der Welt. Entwickelt für deinen Fokus.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default UeberUns;