import { Application } from "@hotwired/stimulus";
import WorkflowBuilder from "./controllers/workflow_builder_controller.js";

const application = Application.start();
application.debug = true;

application.register('workflow-builder', WorkflowBuilder);

// @ts-ignore - This is intentional
window.Stimulus = application;