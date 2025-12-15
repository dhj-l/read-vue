import router from ".";

router.beforeEach((to, from, next) => {
  console.log(to, from);
  next();
});
