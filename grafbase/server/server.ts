import { Hono } from "hono"
import { cors } from "hono/cors"
import { type z } from "zod"
import { serve } from "@hono/node-server"
import { addUser, getUserIdByName } from "grafbase/db/user"
import { getTopic } from "grafbase/db/topic"
import * as edgedb from "edgedb"
import dotenv from "dotenv"

dotenv.config()

export const app = new Hono()
export const client = edgedb.createClient()

app.onError((err, ctx) => {
  if ("format" in err) {
    console.error(JSON.stringify((err as z.ZodError).format(), undefined, 2))
  } else {
    console.error(err)
  }
  return ctx.json({ error: "Internal Server Error" }, 500)
})

app.use("*", cors())

app.get("/topic", async (ctx) => {
  await addUser({ name: "Nikita", email: "nikita@nikiv.dev" })

  return ctx.json({
    name: "Physics",
    content: `# Physics

    [This](https://www.susanrigetti.com/physics) & [this Reddit thread](https://www.reddit.com/r/AskPhysics/comments/sxrg4q/how_can_i_learn_physics_on_my_own/) are nice places to start learning physics. I like reading [AskPhysics subreddit](https://www.reddit.com/r/AskPhysics/).

    [Arvin Ash](https://www.youtube.com/@ArvinAsh/videos), [PBS Space Time](https://www.youtube.com/@pbsspacetime/videos), [Unzicker's Real Physics](https://www.youtube.com/@TheMachian/videos) ([need to double check his content](https://www.math.columbia.edu/~woit/wordpress/?p=6156)) & [Ten Minute Physics](https://matthias-research.github.io/pages/tenMinutePhysics/index.html) are interesting.

    I found studying [Roger Penrose](https://en.wikipedia.org/wiki/Roger_Penrose)'s work mind opening.

    It's wild [how far humans got](https://www.youtube.com/watch?v=PHiyQID7SBs) to understanding physics and especially [quantum physics](quantum-physics/quantum-physics.md).

    Love [Sean Carroll](https://twitter.com/seanmcarroll)'s [book](https://www.preposterousuniverse.com/biggestideas/) and [podcast](https://www.preposterousuniverse.com/podcast/). [Mindscape AMA is great](https://docs.google.com/spreadsheets/d/1i2tmn7L-nlqOz0i-O1MVoOg6kafe9gC45VkaXs0LxMA/edit).

    ## Notes

    - What is energy?
      - There's no satisfying definition beyond "the quantity that is conserved over time." This may sound arbitrary and ad hoc but it emerges from this deep mathematical principal called Noether's theorem that states that for each symmetry (in this case, staying the same while moving forward or backwards in time), there is something that is conserved. In this context, momentum is the thing that is conserved over distance, and angular momentum is the thing that is conserved through rotations.
      - The less rigorous explanation is that it's essentially the currency used by physical systems to undergo change.
    - [One of the things you learn in Physics is that nothing is ever still or completely solid. All atoms vibrate and most(95+%) of their space is empty, where electrons spin. So everything you see is a vibrating mesh of molecules. Neutrinos are so small they can fly straight through everything, even planets! The only time anything stays completely still is at zero degrees Kelvin and it is theorized that time actually stands still at the this temperature.](https://www.reddit.com/r/shrooms/comments/c7i8ee/it_going_to_be_a_good_day/)
    - Emergent complexity: complexity arising from simple rules is interesting. One example of it is [cellular automata](https://natureofcode.com/book/chapter-7-cellular-automata/) and [Conway's game of life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life).
    - [Gravity travels at the speed of light.](https://twitter.com/InertialObservr/status/1270499784546107393)
    - [Acceleration is independent of mass of object.](https://www.reddit.com/r/Physics/comments/iezeqe/gravity/)
    - [Inertia is an intrinsic property and can basically be described as a body’s resistance to acceleration/ change in it’s speed (1st law). What’s intertwined is inertia and force (not acceleration necessarily) since inertia (be it linear or rotational) of a particle would decide how much force is required to produce a certain acceleration (2nd law)](https://www.reddit.com/r/Physics/comments/iezeqe/gravity/)
    - [The future is probability, the past is information, the passage of time is the collapse of one state to the other.](https://www.reddit.com/r/AskPhysics/comments/mk5uo5/what_is_something_you_realized_about_our_universe/)
    - [Because atoms are actually 99.9999% (something similar to the degree) space, everything is also 99.9999% space but things cant pass through each other.](https://www.reddit.com/r/AskPhysics/comments/mk5uo5/what_is_something_you_realized_about_our_universe/)
    - [All matter has kinetic and potential energy. It is easier to think of it as those are the only types of energy.](https://www.reddit.com/r/NoStupidQuestions/comments/nedp7p/if_you_cant_create_or_destroy_energy_then_where/)
    - [Energy can change forms. From heat to potential to kinetic to radiation to heat.](https://www.reddit.com/r/NoStupidQuestions/comments/nedp7p/if_you_cant_create_or_destroy_energy_then_where/)
    - [Gravity propagates at the speed of light.](https://www.reddit.com/r/AskPhysics/comments/s5lcwq/is_gravity_faster_than_light/)

    ## Links

    - [So You Want To Learn Physics...](https://www.susanrigetti.com/physics) ([HN](https://news.ycombinator.com/item?id=24088985))
    - [The Astonishing Simplicity of Everything](https://www.youtube.com/watch?v=f1x9lgX8GaE)
    - [The Map of Physics](https://www.youtube.com/watch?v=ZihywtixUYo)
    - [The Theoretical Minimum Courses](https://theoreticalminimum.com/courses) - Theoretical Physics Education.
    - [Fun to Imagine](https://www.youtube.com/watch?v=eqtuNXWT0mo)
    - [Stephen Hawking had pinned his hopes on 'M-theory' to fully explain the universe—here's what it is](https://phys.org/news/2018-03-stephen-hawking-pinned-m-theory-fully.html)
    - [Ask HN: How to self-learn electronics?](https://news.ycombinator.com/item?id=16775744)
    - [Conceptual illustration of time and space distortion near a mass](https://gfycat.com/AliveIndelibleElkhound)
    - [Amazing Sand Pendulum](https://www.youtube.com/watch?v=kesRiQbm9V0)
    - [Small physics lectures](https://www.youtube.com/playlist?list=PLF71B362214423F9D)
    - [What in physics is fundamental?](https://www.reddit.com/r/askscience/comments/7cnx2u/what_in_physics_is_fundamental/)
    - [The World in UV](https://www.youtube.com/watch?v=V9K6gjR07Po)
    - [Why does it take a million years for a photon moving at the speed of light to reach the sun's surface from its core?](https://www.reddit.com/r/askscience/comments/5q79dy/why_does_it_take_a_million_years_for_a_photon/dcwyis0/)
    - [Why do I study Physics? (2013)](https://www.youtube.com/watch?v=pom8S7qF5Gk)
    - [Is Matter Conscious? (2017)](http://nautil.us/issue/47/consciousness/is-matter-conscious) ([HN](https://news.ycombinator.com/item?id=19240742))
    - [The Mystery at the Bottom of Physics (2019)](https://www.youtube.com/watch?v=EH-z9gE2uGY)
    - [Ask HN: Physicists of HN, what are you working on these days? (2019)](https://news.ycombinator.com/item?id=19500151)
    - [In conversation with Nima Arkani-Hamed (2014)](https://www.youtube.com/watch?v=pup3s86oJXU)
    - [A Peek into Einstein's Zurich Notebook](https://www.pitt.edu/%7Ejdnorton/Goodies/Zurich_Notebook/)
    - [David Tong: Lectures on Theoretical Physics](http://www.damtp.cam.ac.uk/user/tong/teaching.html)
    - [Mathematics for Physics: Crash Course](https://sites.uci.edu/inertialobserver/mathematics-for-physics-crash-course/)
    - [What are some of the "cornerstone books" in physics? (2019)](https://www.reddit.com/r/Physics/comments/ebf5bn/what_are_some_of_the_cornerstone_books_in_physics/)
    - [The Feyman Lectures on Physics](https://www.feynmanlectures.caltech.edu/)
    - [Principles of Optics](https://cds.cern.ch/record/396122/files/0521642221_TOC.pdf) - Electromagnetic theory of propagation, interference and diffraction of light.
    - [What Makes the Hardest Equations in Physics So Difficult? (2019)](https://www.quantamagazine.org/what-makes-the-hardest-equations-in-physics-so-difficult-20180116/)
    - [What are the minimum number of empirical observations/laws necessary to recover modern physics? (2020)](https://www.reddit.com/r/Physics/comments/ekerj7/what_are_the_minimum_number_of_empirical/)
    - [Physics Travel Guide](https://physicstravelguide.com/) - Expository wiki which explains concepts in three levels of difficulty. We call these levels: intuitive, concrete and abstract. ([HN](https://news.ycombinator.com/item?id=22757466))
    - [What is an area of physic that is grossly underrepresented? (2020)](https://www.reddit.com/r/Physics/comments/em8oqd/what_is_an_area_of_physic_that_is_grossly/)
    - [Why the foundations of physics have not progressed for 40 years (2020)](https://iai.tv/articles/why-physics-has-made-no-progress-in-50-years-auid-1292) ([HN](https://news.ycombinator.com/item?id=22033864))
    - [Noether’s Theorem - A Quick Explanation (2019)](https://quantum-friend-theory.tumblr.com/post/172814384897/noethers-theorem-a-quick-explanation) ([HN](https://news.ycombinator.com/item?id=22033012))
    - [Paul Dirac Interview, Göttingen 1982](https://www.youtube.com/watch?v=Et8-gg6XNDY)
    - [Resources for the Physics Olympiad](https://www.reddit.com/r/Physics_olympiad/wiki/index)
    - [Snow Crystals (2019)](https://arxiv.org/abs/1910.06389)
    - [Gears (2020)](https://ciechanow.ski/gears/) ([HN](https://news.ycombinator.com/item?id=22310813))
    - [The Church-Turing Thesis and Physics (2019)](https://video.ethz.ch/speakers/bernays/2019/7b11b50e-f813-4d26-95e0-616cc350708c.html)
    - [Einstein Papers Project](https://www.einstein.caltech.edu/) - Provides the first complete picture of Einstein’s massive written legacy.
    - [Intuitive and visual guide to understanding Maxwell's equations](https://github.com/photonlines/Intuitive-Guide-to-Maxwells-Equations/blob/master/PDF/An%20Intuitive%20Guide%20to%20Maxwell%27s%20Equations.pdf) ([HN](https://news.ycombinator.com/item?id=23700295))
    - [HEPML Resources](https://github.com/iml-wg/HEP-ML-Resources) - Listing of useful learning resources for machine learning applications in high energy physics (HEPML).
    - [Explorable Physics](https://landgreen.github.io/physics/index.html) - Course notes for algebra based physics with explorable explanations. ([Code](https://github.com/landgreen/physics))
    - [Ask HN: How to Self Study Physics? (2020)](https://news.ycombinator.com/item?id=22682837)
    - [Information Is Physics](https://cacm.acm.org/magazines/2019/11/240356-information-is-physics/fulltext) ([HN](https://news.ycombinator.com/item?id=21665931))
    - [Dr. Neil Turok - "From zero to infinity, and beyond!" (2012)](https://www.youtube.com/watch?v=URYOkgbr604)
    - [Sir Roger Penrose - Plotting the Twist of Einstein’s Legacy (2020)](https://overcast.fm/+TYXKbJ8js)
    - [Roger Penrose | Interview | Gravity, Hawking Points and Twistor Theory (2019)](https://www.youtube.com/watch?v=9Gl8pwY2kW8)
    - [Why is Maxwell’s Theory so hard to understand? (2007)](https://www.damtp.cam.ac.uk/user/tong/em/dyson.pdf) ([HN](https://news.ycombinator.com/item?id=22810867))
    - [How to learn quantum mechanics on your own (2019)](https://lookingglassuniver.wixsite.com/blog/post/how-to-learn-quantum-mechanics-on-your-own) ([Video](https://www.youtube.com/watch?v=Rs572Cf4zkk))
    - [Shining a Flashlight on Digital Holography (2020)](https://blog.lookingglassfactory.com/process/shining-a-flashlight-on-digital-holography/) ([HN](https://news.ycombinator.com/item?id=22832627))
    - [HN: Scientists use the Tokyo Skytree to test general relativity (2020)](https://news.ycombinator.com/item?id=22831715)
    - [The Biggest Ideas in the Universe (2020)](https://www.youtube.com/playlist?list=PLrxfgDEc2NxZJcWcrxH3jyjUUrJlnoyzX)
    - [Essays by Jakob Schwichtenberg](http://jakobschwichtenberg.com/archive/)
    - [Physics From Symmetry book (2015)](http://physicsfromsymmetry.com/)
    - [No-Nonsense Books on Physics](https://nononsensebooks.com/)
    - [The Wolfram Physics Project (2020)](https://www.wolframphysics.org/) ([HN](https://news.ycombinator.com/item?id=22866284)) ([Video](https://www.youtube.com/watch?v=rbfFt2uNEyQ)) ([Article](https://writings.stephenwolfram.com/2020/04/finally-we-may-have-a-path-to-the-fundamental-theory-of-physics-and-its-beautiful/)) ([Code](https://github.com/maxitg/SetReplace))
    - [The Wolfram Physics Project: The First Two Weeks (2020)](https://writings.stephenwolfram.com/2020/04/the-wolfram-physics-project-the-first-two-weeks/#what-about-peer-review-and-all-that)
    - [Why Stephen Wolfram’s research program is a dead end (2020)](https://www.singlelunch.com/2020/04/23/why-stephen-wolframs-research-program-is-a-dead-end/) ([Reddit](https://www.reddit.com/r/math/comments/g6qg0k/why_stephen_wolframs_research_program_is_a_dead/))
    - [A Class of Models with the Potential to Represent Fundamental Physics](https://www.wolframphysics.org/technical-introduction/) ([Twitter](https://twitter.com/cmuratori/status/1250116047585210369))
    - [Why is the speed of light a constant?](https://www.reddit.com/r/AskPhysics/comments/g1fx1l/why_is_the_speed_of_light_a_constant/)
    - [The Meaning of Einstein's Equation](http://math.ucr.edu/home/baez/einstein/)
    - [John Baez’s research/blog](http://math.ucr.edu/home/baez/)
    - [Why is light slower in glass? - Sixty Symbols (2013)](https://www.youtube.com/watch?v=CiHN0ZWE5bk)
    - [Quantum Fields: The Real Building Blocks of the Universe - David Tong (2017)](https://www.youtube.com/watch?v=zNVQfWC_evg)
    - [David Tong's research papers](https://arxiv.org/a/tong_d_1.html)
    - [Are quantum fields in any way similar to classical fields? (2020)](https://www.reddit.com/r/askscience/comments/fo4igl/are_quantum_fields_in_any_way_similar_to/)
    - [QED: The Strange Theory of Light and Matter (2020)](https://medium.com/cantors-paradise/qed-the-strange-theory-of-light-and-matter-df50782b1651) ([Reddit](https://www.reddit.com/r/Physics/comments/gc3mp8/qed_the_strange_theory_of_light_and_matter/))
    `,
  })
})

app.get("/sidebar", async (ctx) => {
  return ctx.json({
    topics: [
      "Analytics",
      "Analytics/Grafana",
      "Analytics/Tinybird",
      "Animals",
      "Animals/Birds",
      "API",
      "API/tRPC",
    ],
  })
})

async function main() {
  serve(app)
    .listen(3000)
    .once("listening", () => {
      console.log("🚀 Server started on port 3000")
    })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
