import tryCatch from "../utils/tryCatch.js";
import Content from "../models/contentModel.js";
import Blog from "../models/blogModel.js"
import FAQCategory from "../models/faqCategoryModel.js";
import FAQ from "../models/faqModel.js";
import Course from "../models/courseModel.js";


const getHomePage = tryCatch(async (req, res) => {
  const sliderArena = await Content.findOne({
    page: 'homepage',
    type: 'sliderArena'
  });
  const codingQualityArena = await Content.findOne({
    page: 'homepage',
    type: 'codingQualityArena'
  });
  const advanceTab = await Content.findOne({
    page: 'homepage',
    type: 'advanceTab'
  });
  const coursePresentation = await Content.findOne({
    page: 'homepage',
    type: 'coursePresentation'
  });
  const eventPresentation = await Content.findOne({
    page: 'homepage',
    type: 'eventPresentation'
  });
  const shopPresentation = await Content.findOne({
    page: 'homepage',
    type: 'shopPresentation'
  });
  const blogPresentation = await Content.findOne({
    page: 'homepage',
    type: 'blogPresentation'
  });

  res.render("homepage",{sliderArena,codingQualityArena,advanceTab,coursePresentation,eventPresentation,shopPresentation,blogPresentation});
});
const getContactPage = tryCatch(async (req, res) => {
  const contactUs = await Content.findOne({
    page: 'contact',
    type: 'contactUs'
  });
  const contactForm = await Content.findOne({
    page: 'contact',
    type: 'contactForm'
  });
  console.log(contactForm);
  res.render("contact",{contactForm,contactUs});
});
const getAboutPage = tryCatch(async (req, res) => {
  const bannerArena = await Content.findOne({
    page: 'about',
    type: 'bannerArena'
  });
  const aboutArena = await Content.findOne({
    page: 'about',
    type: 'aboutArena'
  });
  const buttonArena = await Content.findOne({
    page: 'about',
    type: 'buttonArena'
  });
  res.render("about",{bannerArena,aboutArena,buttonArena});
});
const getBlogPage = tryCatch(async (req, res) => {
  const blogs = await Blog.find({})
  if (!blogs) {
    res.redirect("back")
  }
  console.log(blogs);
  res.render("blog",{blogs});
});
const getBlogDetailPage = tryCatch(async (req, res) => {

  const blog = await Blog.findOne({seoUrl:req.params.seourl})
  if (!blog) {
    res.redirect("back")
  }
  res.render("blog-details",{blog});
});
const getCoursePage = tryCatch(async (req, res) => {
  const courses = await Course.find({})
  console.log(courses);
  res.render("course",{courses});
});
const getCourseDetailPage = tryCatch(async (req, res) => {
  const course = await Course.findOne({seoUrl:req.params.seourl})
  if (!course) {
    res.redirect("back")
  }
  console.log(course);
  res.render("course-detail",{course});
});
const getFaqPage = tryCatch(async (req, res) => {
  const allList = [];
  const categories = await FAQCategory.find({
    isVisible: true
  });


  if (categories?.length > 0) {
    await Promise.all(categories.map(async c => {
      const questions = await FAQ.find({
        faqCategoryId: c._id,
        isStatus: true
      });
      allList.push({
        title: c.faqCategoryName,
        questions
      })
    }))
  }
  res.render("faq", {
    list: allList
  })
});
export {
  getHomePage,
  getContactPage,
  getAboutPage,
  getBlogDetailPage,
  getBlogPage,
  getCoursePage,
  getCourseDetailPage,
  getFaqPage,
};
