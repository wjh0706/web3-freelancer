const mongoose = require('mongoose');
const { ProcessStatus } = require('../../common/process-status');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

module.exports.ProcessStatus = ProcessStatus;

const projectSchema = new mongoose.Schema(
  {
    creatorId: {
      type: String,
      required: true,
    },
    verifierId: {
      type: String,
      required: true,
    },
    freelancerId: {
      type: String,
      required: false,
    },
    projectName: {
      type: String,
      required: true,
    },
    contractAddress: {
      type: String,
      required: true,
    },
    posterCode: {
      type: String,
      required: true,
    },
    // verificationCode: {
    //   type: String,
    //   required: false,
    // },
    projectDescription: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    lastModifiedAt: {
      type: Date,
      default: new Date(),
    },
    processStatus: {
      type: String,
      enum: Object.values(ProcessStatus),
      default: ProcessStatus.NotStarted,
    },
    price: {
      type: Number,
      required: true,
    },
    submittedCode: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

projectSchema.set('versionKey', 'version');
projectSchema.plugin(updateIfCurrentPlugin);

projectSchema.statics.build = (attrs) => {
  return new Project(attrs);
};

projectSchema.statics.findByEvent = (event) => {
  return Project.findOne({
    _id: new mongoose.Types.ObjectId(event.projectId),
  });
};

const Project = mongoose.model('Project', projectSchema);

module.exports = { Project, ProjectDoc: Project };
