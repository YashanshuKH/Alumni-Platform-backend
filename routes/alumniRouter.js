const path =require('path')

const express=require('express')
const alumniRouter=express.Router()

const alumniController=require("../Controllers/alumniController")

const postJobController = require("../controllers/postJobController");

alumniRouter.post("/:userId/post-job", alumniController.postJob);

alumniRouter.get("/:userId/post-job", alumniController.getPostedJobs);

alumniRouter.put("/:userId/post-job/:jobId", alumniController.updatePostedJob);

alumniRouter.delete("/:userId/post-job/:jobId", alumniController.deletePostedJob);

module.exports = alumniRouter;
