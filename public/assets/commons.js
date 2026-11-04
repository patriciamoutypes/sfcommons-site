gsap.registerPlugin(ScrollTrigger);

let typeSplit = new SplitType(
  ".title-common , h3 , .title-common-2, .title-opct",
  {
    types: "words, chars",
    tagName: "span"
  }
);
let tl = gsap.timeline({ delay: 0, autoAlpha: 0 });

// ScrollTrigger.matchMedia({
//   "(min-width: 800px)": () => {
//     tl.to(
//       ".image-1-bg-headline",
//       {
//         height: "65vh",
//         // opacity: 0,
//         stagger: { each: 0.03 },
//         ease: "power2.inOut",
//         duration: 1
//       },
//       0.3
//     ).to(
//       ".image-2-bg-headline",
//       {
//         height: "60vh",
//         // opacity: 0,
//         stagger: { each: 0.03 },
//         ease: "power2.inOut",
//         duration: 1
//       },
//       0.5
//     );
//   },
//   "(max-width: 600px)": () => {
//     tl.to(
//       ".image-1-bg-headline",
//       {
//         height: "65vh",
//         // opacity: 0,
//         stagger: { each: 0.03 },
//         ease: "power2.inOut",
//         duration: 1
//       },
//       0.3
//     ).to(
//       ".image-2-bg-headline",
//       {
//         height: "35vh",
//         // opacity: 0,
//         stagger: { each: 0.03 },
//         ease: "power2.inOut",
//         duration: 1
//       },
//       0.5
//     );
//   }
// });

tl.from(
  ".title-common .word .char",
  {
    y: "120%",
    opacity: 0,
    stagger: { each: 0.05 },
    ease: "power2.inOut",
    duration: 0.5
  },
  0.2
)
  .from(
    ".title-common-2 .word",
    {
      y: "120%",
      opacity: 0,
      stagger: { each: 0.03 },
      ease: "power2.inOut",
      duration: 0.5
    },
    0
  )
  .from("h3 .word", {
    y: "120%",
    opacity: 0,
    stagger: { each: 0.03 },
    ease: "power2.inOut",
    duration: 0.5
  })
  .from(
    ".navlink",
    {
      y: "-120%",
      opacity: 0,
      stagger: { each: 0.03 },
      ease: "power2.inOut",
      duration: 0.5
    },
    0.3
  )
  .from(
    ".button",
    {
      y: "-120%",
      opacity: 0,
      stagger: { each: 0.03 },
      ease: "power2.inOut",
      duration: 0.5
    },
    0.3
  );

// $(".wrap-event-block").each(function (index) {
//   let tl = gsap.timeline({ paused: true });
//   tl.to($(this).find(".title-opct .char"), {
//     y: "+120%",
//     opacity: 1,
//     stagger: { each: 0.001 },
//     ease: "power2.inOut",
//     duration: 0.1
//   });

//   $(this).on("mouseenter", function () {
//     tl.restart();
//   });
//   $(this).on("mouseleave", function () {
//     tl.reverse();
//   });
// });
