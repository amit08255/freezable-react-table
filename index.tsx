/* eslint-disable react/destructuring-assignment,
prefer-destructuring,react/jsx-props-no-spreading */

import React from 'react';
import styled, { css } from 'styled-components';

type Props = {
    stickyHeaderCount?: number,
    leftStickyColumnCount?: number,
    rightStickyColumnCount?: number,
    stickyFooterCount?: number,
    headerZ?: number,
    leftColumnZ?: number,
    rightColumnZ?: number,
    footerZ?: number,
    borderWidth?: string,
    borderColor?: string,
    wrapperRef?: any,
}

const getBorder = (props) => `${props.borderWidth === undefined ? '2px' : (props.borderWidth || '0px')} solid ${props.borderColor || '#e5e5e5'}`;

const Table = styled('table').attrs(() => ({
    className: 'sticky-table-table',
}))`
  white-space: nowrap;
  box-sizing: border-box;
`;

Table.displayName = 'Table';

const Cell = styled('td').attrs((props) => ({
    className: 'sticky-table-cell',
    ...props,
}))`
  box-sizing: border-box;
  padding: 0.5rem 0.75rem;
  background-color: #fff;
`;

Cell.displayName = 'Cell';

const Row = styled('tr').attrs((props) => ({
    className: 'sticky-table-row',
    ...props,
}))`
`;

Row.displayName = 'Row';

const Wrapper = styled('div').attrs(() => ({
    className: 'sticky-table',
}))`
  position: relative;
  overflow: auto;
  height: 100%;
  box-sizing: border-box;

  & ${Row}:not(:nth-last-child(-n+${(props) => (props.stickyFooterCount || 0) + 1})) ${Cell} {
    border-bottom: ${getBorder};
  }

  & ${Row}:nth-child(${(props) => `-n+${props.stickyHeaderCount}`}) ${Cell} {
    position: -webkit-sticky;
    position: sticky;
    top: 0px;
    z-index: ${(props) => props.headerZ || 2};
  }
  & ${Row}:nth-last-child(-n+${(props) => props.stickyFooterCount}) ${Cell} {
    position: -webkit-sticky;
    position: sticky;
    bottom: 0px;
    z-index: ${(props) => props.footerZ || 2};
    border-top: ${getBorder};
  }
  & ${Row} ${Cell}:nth-child(-n+${(props) => props.leftStickyColumnCount}) {
    position: -webkit-sticky;
    position: sticky;
    left: 0px;
    z-index: ${(props) => props.leftColumnZ || 2};
    border-right: ${getBorder};
  }
  & ${Row} ${Cell}:nth-last-child(-n+${(props) => props.rightStickyColumnCount}) {
    position: -webkit-sticky;
    position: sticky;
    right: 0px;
    z-index: ${(props) => props.rightColumnZ || 2};
    border-left: ${getBorder};
  }

  ${(props) => {
    const insets = props.stickyInsets;
    let styles = '';
    let i;

    for (i = 0; i < insets.header.length; i += 1) {
        styles += `& ${Row}:nth-child(${i + 1}) ${Cell} { top: ${insets.header[i]}px; }`;
    }

    for (i = 0; i < insets.footer.length; i += 1) {
        styles += `& ${Row}:nth-last-child(${i + 1}) ${Cell} { bottom: ${insets.footer[i]}px; }`;
    }

    for (i = 0; i < insets.leftColumn.length; i += 1) {
        styles += `& ${Row} ${Cell}:nth-child(${i + 1}) { left: ${insets.leftColumn[i]}px; }`;
    }

    for (i = 0; i < insets.rightColumn.length; i += 1) {
        styles += `& ${Row} ${Cell}:nth-last-child(${i + 1}) { right: ${insets.rightColumn[i]}px; }`;
    }

    return css`${styles}`;
}}

  & ${Row}:nth-child(-n+${(props) => props.stickyHeaderCount}) ${Cell}:nth-child(-n+${(props) => props.leftStickyColumnCount}) {
    z-index: ${(props) => Math.max(props.headerZ || 2, props.leftColumnZ || 2) + 1};
  }
  & ${Row}:nth-child(-n+${(props) => props.stickyHeaderCount}) ${Cell}:nth-last-child(-n+${(props) => props.rightStickyColumnCount}) {
    z-index: ${(props) => Math.max(props.headerZ || 2, props.rightColumnZ || 2) + 1};
  }
  & ${Row}:nth-last-child(-n+${(props) => props.stickyFooterCount}) ${Cell}:nth-child(-n+${(props) => props.leftStickyColumnCount}) {
    z-index: ${(props) => Math.max(props.footerZ || 2, props.leftColumnZ || 2) + 1};
  }
  & ${Row}:nth-last-child(-n+${(props) => props.stickyFooterCount}) ${Cell}:nth-last-child(-n+${(props) => props.rightStickyColumnCount}) {
    z-index: ${(props) => Math.max(props.footerZ || 2, props.rightColumnZ || 2) + 1};
  }
`;

Wrapper.displayName = 'Wrapper';

class FreezableTable extends React.Component<Props, any> {
    tableNode = null;

    multipleStickiesInterval = null;

    constructor(props) {
        super(props);

        this.state = {
            stickyInsets: {
                header: [],
                footer: [],
                leftColumn: [],
                rightColumn: [],
            },
        };

        this.tableNode = null;
        this.multipleStickiesInterval = null;
    }

    componentDidMount() {
        this.considerSchedulingMultipleStickiesInterval();
    }

    componentDidUpdate() {
        this.considerSchedulingMultipleStickiesInterval();
    }

    componentWillUnmount() {
        this.clearMultipleStickiesInterval();
    }

    setTableNodeRef = (tableNode) => {
        this.tableNode = tableNode;
    };

    // HINT schedule an interval to poll cell sizes for changes at 60fps
    // WARNING avoid doing this unless user has at least 2 stickies somewhere
    considerSchedulingMultipleStickiesInterval() {
        const p = this.props;
        const shouldSchedule = [
            p.stickyHeaderCount, p.stickyFooterCount, p.leftStickyColumnCount,
            p.rightStickyColumnCount,
        ].some((count) => count > 1);

        // HINT clear out stickyInsets of a new interval won't be set
        if (!shouldSchedule && this.multipleStickiesInterval) {
            this.setState({
                stickyInsets: {
                    header: [], footer: [], leftColumn: [], rightColumn: [],
                },
            });
        }

        this.clearMultipleStickiesInterval();

        if (shouldSchedule) {
            this.multipleStickiesInterval = setInterval(
                this.checkForStickySizeChanges.bind(this),
                1000 / 60,
            );
        }
    }

    clearMultipleStickiesInterval() {
        if (this.multipleStickiesInterval) {
            clearInterval(this.multipleStickiesInterval);

            delete this.multipleStickiesInterval;
        }
    }

    checkForStickySizeChanges() {
        let s; const
            stickyInsets = {};
        const { props, tableNode } = this;
        const rowNodes = tableNode.querySelectorAll('.sticky-table-row');
        const cellNodes = tableNode.querySelectorAll('.sticky-table-cell');

        [
            ['header', 'height', 'stickyHeaderCount'],
            ['footer', 'height', 'stickyFooterCount'],
            ['leftColumn', 'width', 'leftStickyColumnCount'],
            ['rightColumn', 'width', 'rightStickyColumnCount'],
        ].forEach(([stickyKey, sizeKey, countPropKey]) => {
            let insets = [];

            if (props[countPropKey] > 1) {
                insets = [0];
                const count = props[countPropKey];
                let netInset = 0;

                // HINT we only want this loop for the second sticky and up
                for (s = 1; s < count; s += 1) {
                    let node;

                    switch (stickyKey) {
                    case 'header':
                        node = rowNodes[s - 1].childNodes[0];
                        break;
                    case 'footer':
                        node = rowNodes[rowNodes.length - s].childNodes[0];
                        break;
                    case 'leftColumn':
                        node = cellNodes[s - 1];
                        break;
                    case 'rightColumn':
                        node = cellNodes[cellNodes.length - s];
                        break;
                    default:
                        break;
                    }

                    if (node) {
                        const boundingRect = node.getBoundingClientRect();

                        netInset += boundingRect[sizeKey];
                    }

                    insets.push(netInset);
                }
            }

            stickyInsets[stickyKey] = insets;
        });

        // HINT avoid a render unless there's actually a change
        if (JSON.stringify(stickyInsets) !== JSON.stringify(this.state.stickyInsets)) {
            this.setState({ stickyInsets });
        }
    }

    render() {
        const {
            leftStickyColumnCount = 1, stickyHeaderCount = 1, wrapperRef, children, ...restProps
        } = this.props;

        return (
            <Wrapper
                ref={wrapperRef}
                leftStickyColumnCount={leftStickyColumnCount}
                stickyHeaderCount={stickyHeaderCount}
                stickyInsets={this.state.stickyInsets}
                {...restProps}
            >
                <Table ref={this.setTableNodeRef}>{children}</Table>
            </Wrapper>
        );
    }
}

export {
    FreezableTable, Table, Row, Cell,
};
