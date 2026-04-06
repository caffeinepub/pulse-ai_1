import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // User types and comparison modules
  type Password = Text;
  type Username = Text;
  type UserId = Principal;

  type UserSecureData = {
    username : Text;
    password : Text;
  };

  type UserProfile = {
    userId : UserId;
    username : Username;
    displayName : Text;
  };

  module UserProfile {
    public func compareByUsername(userProfile1 : UserProfile, userProfile2 : UserProfile) : Order.Order {
      Text.compare(userProfile1.username, userProfile2.username);
    };
  };

  module UserSecureData {
    public func compare(userSecureData1 : UserSecureData, userSecureData2 : UserSecureData) : Order.Order {
      Text.compare(userSecureData1.username, userSecureData2.username);
    };
  };

  // Authorization system setup
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data storage
  let users = Map.empty<Principal, UserSecureData>();

  func registerUserInternal(userId : UserId, username : Username, password : Text) : () {
    if (users.values().any(func(user) { user.username == username })) {
      Runtime.trap("Username already taken!");
    };

    if (username == "") {
      Runtime.trap("Username cannot be empty!");
    };

    if (password == "") {
      Runtime.trap("Password cannot be empty!");
    };

    let newUser : UserSecureData = {
      username;
      password;
    };

    users.add(userId, newUser);

    // Assign user role directly without admin check (self-registration)
    accessControlState.userRoles.add(userId, #user);
  };

  func loginUserInternal(username : Username, password : Password) : UserId {
    let userEntry = users.entries().find(
      func((_, user)) { user.username == username }
    );

    switch (userEntry) {
      case (null) { Runtime.trap("Username not found!") };
      case (?(userId, user)) {
        if (user.password == password) {
          return userId;
        } else {
          Runtime.trap("Incorrect password!");
        };
      };
    };
  };

  public shared ({ caller }) func register(username : Username, password : Password) : async () {
    registerUserInternal(caller, username, password);
  };

  public shared ({ caller = _ }) func login(username : Username, password : Password) : async UserId {
    loginUserInternal(username, password);
  };

  public shared query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    users.toArray().map(
      func((userId, user)) {
        {
          userId;
          username = user.username;
          displayName = user.username;
        };
      }
    );
  };

  public query ({ caller }) func getUserProfile(userId : UserId) : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (users.get(userId)) {
      case (null) { Runtime.trap("User does not exist!") };
      case (?user) {
        {
          userId;
          username = user.username;
          displayName = user.username;
        };
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (users.get(caller)) {
      case (null) { null };
      case (?user) {
        ?{
          userId = caller;
          username = user.username;
          displayName = user.username;
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(_displayName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User does not exist!") };
      case (?user) {
        let updatedUser : UserSecureData = {
          username = user.username;
          password = user.password;
        };
        users.add(caller, updatedUser);
      };
    };
  };
};
