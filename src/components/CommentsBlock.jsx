import React from "react";
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { AddComment } from './AddComment';

export const CommentsBlock = ({
  items,
  isCommentsLoading,
  onCommentAdded,
  isAuth,
  post
}) => {
  return (
    <SideBlock title="Comments">
      <List>
        {items.map((obj) => (
          <React.Fragment key={obj._id}>
            {obj && obj._id && obj.user && obj.user.fullName && (
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  {isCommentsLoading ? (
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <>
                      <Avatar
                        alt={obj.user.fullName}
                        src={obj.user.avatarUrl}
                      />

                      <p style={{ fontSize: 10 }}>{new Date(obj.createdAt).toLocaleDateString()}</p>
                    </>
                  )}
                </ListItemAvatar>

                {isCommentsLoading ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Skeleton
                      variant="text"
                      height={25}
                      width={120}
                    />

                    <Skeleton
                      variant="text"
                      height={18}
                      width={230}
                    />
                  </div>
                ) : (
                  <ListItemText
                    primary={obj.user.fullName}
                    secondary={obj.text}
                  />
                )}
              </ListItem>
            )}

            <Divider
              variant="inset"
              component="li"
            />
          </React.Fragment>
        ))}
      </List>

      {isAuth && (
        <AddComment
          post={post}
          onCommentAdded={onCommentAdded}
        />
      )}
    </SideBlock>
  );
};