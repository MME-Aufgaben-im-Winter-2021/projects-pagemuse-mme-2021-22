/* global Appwrite */

import Logger from "../utils/Logger.js";

const ENDPOINT = "https://appwrite.software-engineering.education/v1",
  PROJECT_ID = "6206643994b46f11896b",
  SDK = new Appwrite();

class AppwriteService {

  constructor() {
    Logger.log("Creating Appwrite service");
    SDK.setEndpoint(ENDPOINT).setProject(PROJECT_ID);
  }

  /**
   * Trys to connect to the Appwrite server with the given user credentials. Returns a promise,
   * that will resolve to "OK" when user was logged in successfully or "ERROR" if no session could
   * be established. If successfully, the new session will be stored internally.
   * 
   * @param {String} email of the user to be logged in
   * @param {String} password of the user to be logged in
   * @returns A promise, resolved to a status code, describing the success of this request
   */
  async openSession(email, password) {
    try {
      this.session = await SDK.account.createSession(email, password);
      Logger.log(`Opened user session for ${email}`);
      return this.StatusCodes.OK;
    } catch (error) {
      Logger.error(`Error while opening user session for ${email}`);
      return this.StatusCodes.ERROR;
    }
  }

  /**
   * Trys to create a new user on the Appwrite server, using the given credentials. Returns a promise,
   * that will resolve to "OK" when the new user was created successfully or "ERROR" if no user could
   * be created.
   * 
   * @param {String} username of the user to be created
   * @param {String} email of the user to be created
   * @param {String} password of the user to be created
   * @returns 
   */
  async createUser(username, email, password) {
    try {
      let user = await SDK.account.create("unique()", email, password, username); // Let Appwrite create a unique ID for this new user
      Logger.log(`Created new user (id = ${user.$id})`);
      return this.StatusCodes.OK;
    } catch (error) {
      Logger.error("Error while creating new user");
      Logger.error(error);
      return this.StatusCodes.ERROR;
    }
  }

}

AppwriteService.prototype.StatusCodes = {
  OK: "OK",
  ERROR: "ERROR",
};

export default new AppwriteService();