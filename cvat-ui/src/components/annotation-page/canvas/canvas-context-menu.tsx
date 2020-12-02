// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import ReactDOM from 'react-dom';
import Menu, { ClickParam } from 'antd/lib/menu';

import ObjectItemContainer from 'containers/annotation-page/standard-workspace/objects-side-bar/object-item';
import { Workspace } from 'reducers/interfaces';
import consts from 'consts';

interface Props {
    readonly: boolean;
    workspace: Workspace;
    contextMenuClientID: number | null;
    objectStates: any[];
    visible: boolean;
    left: number;
    top: number;
    onStartIssue(position: number[]): void;
    openIssue(position: number[], message: string): void;
    latestComments: string[];
}

interface ReviewContextMenuProps {
    top: number;
    left: number;
    latestComments: string[];
    onClick: (param: ClickParam) => void;
}

enum ReviewContextMenuKeys {
    OPEN_ISSUE = 'open_issue',
    QUICK_ISSUE_POSITION = 'quick_issue_position',
    QUICK_ISSUE_ATTRIBUTE = 'quick_issue_attribute',
    QUICK_ISSUE_FROM_LATEST = 'quick_issue_from_latest',
}

function ReviewContextMenu({
    top, left, latestComments, onClick,
}: ReviewContextMenuProps): JSX.Element {
    return (
        <Menu onClick={onClick} selectable={false} className='cvat-canvas-context-menu' style={{ top, left }}>
            <Menu.Item className='cvat-context-menu-item' key={ReviewContextMenuKeys.OPEN_ISSUE}>
                Open an issue ...
            </Menu.Item>
            <Menu.Item className='cvat-context-menu-item' key={ReviewContextMenuKeys.QUICK_ISSUE_POSITION}>
                Quick issue: incorrect position
            </Menu.Item>
            <Menu.Item className='cvat-context-menu-item' key={ReviewContextMenuKeys.QUICK_ISSUE_ATTRIBUTE}>
                Quick issue: incorrect attribute
            </Menu.Item>
            {latestComments.length ? (
                <Menu.SubMenu
                    title='Quick issue ...'
                    className='cvat-context-menu-item'
                    key={ReviewContextMenuKeys.QUICK_ISSUE_FROM_LATEST}
                >
                    {latestComments.map(
                        (comment: string, id: number): JSX.Element => (
                            <Menu.Item className='cvat-context-menu-item' key={`${id}`}>
                                {comment}
                            </Menu.Item>
                        ),
                    )}
                </Menu.SubMenu>
            ) : null}
        </Menu>
    );
}

export default function CanvasContextMenu(props: Props): JSX.Element | null {
    const {
        contextMenuClientID,
        objectStates,
        visible,
        left,
        top,
        readonly,
        workspace,
        latestComments,
        onStartIssue,
        openIssue,
    } = props;

    if (!visible || contextMenuClientID === null) {
        return null;
    }

    if (workspace === Workspace.REVIEW_WORKSPACE) {
        return ReactDOM.createPortal(
            <ReviewContextMenu
                key={contextMenuClientID}
                top={top}
                left={left}
                latestComments={latestComments}
                onClick={(param: ClickParam) => {
                    const [state] = objectStates.filter(
                        (_state: any): boolean => _state.clientID === contextMenuClientID,
                    );
                    if (param.key === ReviewContextMenuKeys.OPEN_ISSUE) {
                        if (state) {
                            onStartIssue(state.points);
                        }
                    } else if (param.key === ReviewContextMenuKeys.QUICK_ISSUE_POSITION) {
                        if (state) {
                            openIssue(state.points, consts.QUICK_ISSUE_INCORRECT_POSITION_TEXT);
                        }
                    } else if (param.key === ReviewContextMenuKeys.QUICK_ISSUE_ATTRIBUTE) {
                        if (state) {
                            openIssue(state.points, consts.QUICK_ISSUE_INCORRECT_ATTRIBUTE_TEXT);
                        }
                    } else if (
                        param.keyPath.length === 2 &&
                        param.keyPath[1] === ReviewContextMenuKeys.QUICK_ISSUE_FROM_LATEST
                    ) {
                        if (state) {
                            openIssue(state.points, latestComments[+param.keyPath[0]]);
                        }
                    }
                }}
            />,
            window.document.body,
        );
    }

    return ReactDOM.createPortal(
        <div className='cvat-canvas-context-menu' style={{ top, left }}>
            <ObjectItemContainer
                readonly={readonly}
                key={contextMenuClientID}
                clientID={contextMenuClientID}
                objectStates={objectStates}
                initialCollapsed
            />
        </div>,
        window.document.body,
    );
}