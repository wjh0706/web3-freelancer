import mongoose from "mongoose";
import { ProcessStatus } from "../../common/src/events/types/process-status";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { ProcessStatus };

interface ProjectAttrs {
  creatorId: string;
  verifierId: string;
  projectName: string;
  price: number;
  verificationcode: string;
  linkOfVerCode: string;
  projectDescription: String;
  createdAt: Date;
}

interface ProjectDoc extends mongoose.Document {
  creatorId: string;
  verifierId: string;
  projectName: string;
  projectDescription: String;
  createdAt: Date;
  lastModifiedAt: Date;
  version: number;
  price: number;
  verificationcode: string;
  processStatus: ProcessStatus;
  output_file: string; //FilesDoc;
}

interface ProjectModel extends mongoose.Model<ProjectDoc> {
  build(attrs: ProjectAttrs): ProjectDoc;
  findByEvent(event: { projectId: string }): Promise<ProjectDoc | null>;
}

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
    projectName: {
      type: String,
      required: true,
    },
    verificationcode: {
      type: String,
      required: true,
    },
    linkOfVerCode: {
      type: String,
      required: true,
    },
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
    output_file: {
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

projectSchema.set("versionKey", "version");
projectSchema.plugin(updateIfCurrentPlugin);

projectSchema.statics.build = (attrs: ProjectAttrs) => {
  return new Project(attrs);
};

projectSchema.statics.findByEvent = (event: { projectId: string }) => {
  return Project.findOne({
    _id: new mongoose.Types.ObjectId(event.projectId),
  });
};
const Project = mongoose.model<ProjectDoc, ProjectModel>(
  "Project",
  projectSchema
);

export { Project, ProjectDoc };
