const path =require('path')

const express=require('express')
const alumniRouter=express.Router()

const alumniController=require("../Controllers/alumniController")

alumniRouter.get("/alumnidata",alumniController.getAlumni)
// alumniRouter.post("/:userId/post_job", alumniController.postJob);
// alumniRouter.get("/:userId/post_job", alumniController.getPostedJobs);
// alumniRouter.put("/:userId/post_job/:jobId", alumniController.updatePostedJob);
// alumniRouter.delete("/:userId/post_job/:jobId", alumniController.deletePostedJob);


module.exports = alumniRouter;
