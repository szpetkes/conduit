import type { Drash } from "../deps.ts";
import BaseResource from "./base_resource.ts";
import UserModel from "../models/user_model.ts";
import UserFavoritesModel from "../models/user_favorites_model.ts";

class ProfilesResource extends BaseResource {
  static paths = [
    "/api/profiles/:username",
    "/api/profiles/:username/follow",
  ];

  public async POST(): Promise<Drash.Http.Response> {
    console.log("Handling ProfilesResource POST.");

    if (this.request.url_path.includes("/follow")) {
      return await this.createFollow();
    }

    this.response.body = {
      errors: {
        username: ["Not supported."],
      },
    };

    return this.response;
  }

  public async DELETE(): Promise<Drash.Http.Response> {
    console.log("Handling ProfilesResource DELETE.");

    if (this.request.url_path.includes("/follow")) {
      return await this.deleteFollow();
    }

    this.response.body = {
      errors: {
        username: ["Not supported."],
      },
    };

    return this.response;
  }

  public async GET() {
    return this.getProfile()    
  }

  protected async getProfile(): Promise<Drash.Http.Response> {
    console.log("Handling ProfilesResource GET.");
    const username = this.request.getPathParam("username") || "";
    console.log(`Handling the following user's profile: ${username}.`);

    if (!username) {
      this.response.status_code = 422;
      this.response.body = {
        errors: {
          username: ["Username path param is required."],
        },
      };
      // TODO(ebebbington) Return response
    }

    this.response.body = {
      profile: null,
    };

    const result = await UserModel.where({ username: username });
    if (result.length <= 0) {
      return this.errorResponse(404, "Profile not found.");
    }

    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return this.errorResponse(
        400,
        "`user_id` field is required.",
      );
    }

    const entity = result[0].toEntity();
    entity.followed = await this.isFollowedProfile(result[0].id, currentUser.id)
    this.response.body = {
      profile: entity,
    };

    return this.response;
  }

  /**
   * @return Promise<Drash.Http.Response>
   *     Returns.
   */
   protected async createFollow(): Promise<Drash.Http.Response> {
    console.log("Handling action: toggleFollow.");
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return this.errorResponse(
        400,
        "`user_id` field is required.",
      );
    }

    const username = this.request.getPathParam("username") || "";
    console.log(`Handling the following user's profile: ${username}.`);

    if (!username) {
      this.response.status_code = 422;
      this.response.body = {
        errors: {
          username: ["Username path param is required."],
        },
      };
      // TODO(ebebbington) Return response
    }

    this.response.body = {
      profile: null,
    };

    const result = await UserModel.where({ username: username });
    if (result.length <= 0) {
      return this.errorResponse(404, "Profile not found.");
    }
  
    let favorite;

    favorite = new UserFavoritesModel(
      result[0].id,
      currentUser.id,
      true,
      0
    );
    await favorite.save();

    return this.getProfile();
  }

  /**
   * @return Promise<Drash.Http.Response>
   *     Returns.
   */
   protected async deleteFollow(): Promise<Drash.Http.Response> {
    console.log("Handling action: deleteFollow.");
    console.log(this.request)
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return this.errorResponse(
        400,
        "`user_id` field is required.",
      );
    }

    const username = this.request.getPathParam("username") || "";
    console.log(`Handling the following user's profile: ${username}.`);

    if (!username) {
      this.response.status_code = 422;
      this.response.body = {
        errors: {
          username: ["Username path param is required."],
        },
      };
      // TODO(ebebbington) Return response
    }

    this.response.body = {
      profile: null,
    };

    const result = await UserModel.where({ username: username });
    if (result.length <= 0) {
      return this.errorResponse(404, "Profile not found.");
    }
  
    const uf = await UserFavoritesModel.where({ favorited_user_id: result[0].id, user_id: currentUser.id})
    if(uf.length>0) {
      uf[0].delete();
    }

    return this.getProfile();
  }

  protected async isFollowedProfile(profile_id: number, user_id: number) {
    const uf = await UserFavoritesModel.where({ favorited_user_id: profile_id, user_id: user_id})
    if (uf.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  
}

export default ProfilesResource;
