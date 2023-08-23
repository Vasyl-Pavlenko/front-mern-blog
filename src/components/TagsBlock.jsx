import React from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TagIcon from '@mui/icons-material/Tag';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import { SideBlock } from './SideBlock';

export const TagsBlock = ({
  items,
  isLoading = true,
}) => {
  const navigate = useNavigate();

  const uniqueTags = Array.from(new Set(items)); 

  return (
    <SideBlock title="Tags">
      <List>
        {uniqueTags.map((name) => (
          <ListItem
            key={name}
            disablePadding
            onClick={() => {
              const encodedTagName = encodeURIComponent(name); 
              navigate(`/tags/${encodedTagName}`);
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                <TagIcon />
              </ListItemIcon>
              
              {isLoading ? <Skeleton width={100} /> : <ListItemText primary={name} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </SideBlock>
  );
};
