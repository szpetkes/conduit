import BaseModel from "./base_model.ts";

export type UserFavoritesEntity = {
  // deno-lint-ignore camelcase
  favorited_user_id: number;
  // deno-lint-ignore camelcase
  user_id: number;
  id: number;
  value: boolean;
};

/**
 * @description
 * Returns an instance of the UserFavoritesModel
 *
 * @param UserFavoritesEntity inputObj
 *
 * @return UserFavoritesModel An instance of the model with all properties set
 */
export function createUserFavoritesModelObject(
  inputObj: UserFavoritesEntity,
): UserFavoritesModel {
  return new UserFavoritesModel(
    inputObj.favorited_user_id,
    inputObj.user_id,
    inputObj.value,
    inputObj.id
  );
}

// (ebebbington) Error comes from this model adding the where method, that uses different
// params compared to BaseModel's where method
export class UserFavoritesModel extends BaseModel {
  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - PROPERTIES //////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @var number
   *
   * id of the associated user id that is favorited in the database
   */
  public favorited_user_id: number;

  /**
   * @var number
   *
   * Id of the associated user in the database
   */
  public user_id: number;

  /**
   * @var number
   *
   * Id of the database row
   */
  public id: number;

  /**
   * @var boolean
   *
   * TODO(ebebbington) What is this property used for?
   */
  public value: boolean;

  /**
   * TODO(ebebbington) What is this property used for?
   */
  public query = "";

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - CONSTRUCTOR /////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param number favoritedUserId
   * @param number authorId
   * @param boolean value
   * @param number id=-1
   */
  constructor(
    favoritedUserId: number,
    authorId: number,
    value: boolean,
    id: number
  ) {
    super();
    this.favorited_user_id = favoritedUserId;
    this.user_id = authorId;
    this.value = value;
    this.id = id;
  }

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - METHODS - CRUD //////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Delete this model.
   *
   * @return Promise<boolean>
   */
  public async delete(): Promise<boolean> {
    const query = `DELETE FROM user_favorites WHERE id = $1`;
    const dbResult = await BaseModel.query(query, this.id);
    if (!dbResult || (dbResult && dbResult.rowCount! < 1)) {
      return false;
    }
    return true;
  }

  /**
   * Save this model.
   *
   * @return Promise<UserFavoritesModel|null> Null if the query failed to save
   */
  public async save(): Promise<UserFavoritesModel | null> {
    const query = "INSERT INTO user_favorites " +
      " (favorited_user_id, user_id, value)" +
      " VALUES ( $1, $2, $3);";
    const dbResult = await BaseModel.query(
      query,
      this.favorited_user_id,
      this.user_id,
      String(this.value),
    );
    if (dbResult.rowCount! < 1) {
      return null;
    }

    const savedResult = await UserFavoritesModel.where(
      { favorited_user_id: this.favorited_user_id },
    );
    if (savedResult.length === 0) {
      return null;
    }
    return savedResult[0];
  }

 
  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - METHODS - STATIC ////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @description
   *     See BaseModel.Where()
   *
   * @param {[key: string]: string|number} fields
   *
   * @return Promise<UserFavoritesModel[]|[]>
   */
  static async where(
    fields: { [key: string]: string | number },
  ): Promise<UserFavoritesModel[] | []> {
    const results = await BaseModel.Where("user_favorites", fields);

    if (results.length <= 0) {
      return [];
    }

    // Nothing we can do about this.. the createUserModelObject expect
    // a user object type, but there's no way to type it like that the return type of whereIn can't be user
    const userFavorites: Array<UserFavoritesModel> = [];
    results.forEach((result) => {
      console.log(result)
      const entity: UserFavoritesEntity = {
        "favorited_user_id": typeof result.favorited_user_id === "number"
          ? result.favorited_user_id
          : 0,
        id: result.id as number,
        "user_id": typeof result.user_id === "number" ? result.user_id : 0,
        value: typeof result.value === "boolean" ? result.value : false,
      };
      userFavorites.push(createUserFavoritesModelObject(entity));
      console.log(userFavorites)
    });
    return userFavorites;
  }


  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - METHODS - PUBLIC ////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @description
   * Constructs an object of this models properties
   *
   * @return UserFavoritesEntity
   */
  public toEntity(): UserFavoritesEntity {
    return {
      id: this.id,
      favorited_user_id: this.favorited_user_id,
      user_id: this.user_id,
      value: this.value,
    };
  }
}

export default UserFavoritesModel;