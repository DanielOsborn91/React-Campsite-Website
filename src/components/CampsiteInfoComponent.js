import React, { Component } from "react";
import {
	Card,
	CardImg,
	CardText,
	CardBody,
	CardTitle,
	Breadcrumb,
	BreadcrumbItem,
	Button,
	Label,
	Col,
	Row,
	Modal,
	ModalBody,
	ModalHeader,
	FormGroup
} from "reactstrap";
import { Link } from "react-router-dom";
import { Control, LocalForm, Errors } from "react-redux-form";
import { Loading } from "./LoadingComponent";
import { baseUrl } from "../shared/baseUrl";
import { FadeTransform, Fade, Stagger } from "react-animation-components";

const required = val => val && val.length;
const maxLength = len => val => !val || val.length <= len;
const minLength = len => val => val && val.length >= len;

class CommentForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isModalOpen: false
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	toggleModal() {
		this.setState({
			isModalOpen: !this.state.isModalOpen
		});
	}

	handleSubmit(values) {
		this.toggleModal();
		this.props.postComment(
			this.props.campsiteId,
			values.rating,
			values.author,
			values.text
		);
	}

	render() {
		return (
			<React.Fragment>
				<Button outline onClick={this.toggleModal}>
					<i className='fa fa-pencil fa-lg' /> Submit Comment
				</Button>

				<Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
					<ModalHeader toggle={this.toggleModal}>
						Leave us a Comment!
					</ModalHeader>
					<ModalBody>
						<LocalForm onSubmit={values => this.handleSubmit(values)}>
							<div className='form-group'>
								<Label htmlFor='rating'>Rating</Label>
								<Control.select model='.rating' id='rating' name='rating'>
									<option value='1'>1</option>
									<option value='2'>2</option>
									<option value='3'>3</option>
									<option value='4'>4</option>
									<option value='5'>5</option>
								</Control.select>
							</div>
							<div className='form-group'>
								<Label htmlFor='author'>Author:</Label>
								<Control.text
									model='.author'
									name='author'
									id='author'
									validators={{
										required,
										minLength: minLength(2),
										maxLength: maxLength(15)
									}}
								/>
								<Errors
									className='text-danger'
									model='.author'
									show='touched'
									component='div'
									messages={{
										minLength: "Must be at least 2 characters",
										maxLength: "Must be 15 characters or less"
									}}
								/>
							</div>
							<div className='form-group'>
								<Label htmlFor='text'>Your Comment:</Label>

								<Control.textarea
									model='.text'
									name='text'
									id='text'
									rows='6'
								/>
							</div>
							<div className='form-group'>
								<Button type='submit' color='primary'>
									Send Feedback
								</Button>
							</div>
						</LocalForm>
					</ModalBody>
				</Modal>
			</React.Fragment>
		);
	}
}

function RenderComments({ comments, postComment, campsiteId }) {
	if (comments) {
		return (
			<div className='col-md-5 m-1'>
				<h4>Comments</h4>
				<Stagger in>
					{comments.map(comment => {
						return (
							<Fade in key={comment.id}>
								<div>
									<p>
										{comment.text}
										<br />
										-- {comment.author},{" "}
										{new Intl.DateTimeFormat("en-US", {
											year: "numeric",
											month: "short",
											day: "2-digit"
										}).format(new Date(Date.parse(comment.date)))}
									</p>
								</div>
							</Fade>
						);
					})}
				</Stagger>
				<CommentForm campsiteId={campsiteId} postComment={postComment} />
			</div>
		);
	}
	return <div></div>;
}

function RenderCampsite({ campsite }) {
	return (
		<div className='col-md-5 m-1'>
			<FadeTransform
				in
				transformProps={{
					exitTransform: "scale(0.5) translateY(-50%)"
				}}>
				<Card>
					<CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
					<CardBody>
						<CardText>{campsite.description}</CardText>
					</CardBody>
				</Card>
			</FadeTransform>
		</div>
	);
}

function CampsiteInfo(props) {
	if (props.isLoading) {
		return (
			<div className='container'>
				<div className='row'>
					<Loading />
				</div>
			</div>
		);
	}
	if (props.errMess) {
		return (
			<div className='container'>
				<div className='row'>
					<div className='col'>
						<h4>{props.errMess}</h4>
					</div>
				</div>
			</div>
		);
	}
	if (props.campsite) {
		return (
			<div className='container'>
				<div className='row'>
					<div className='col'>
						<Breadcrumb>
							<BreadcrumbItem>
								<Link to='/directory'>Directory</Link>
							</BreadcrumbItem>
							<BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
						</Breadcrumb>
						<h2>{props.campsite.name}</h2>
						<hr />
					</div>
				</div>
				<div className='row'>
					<RenderCampsite campsite={props.campsite} />
					<RenderComments
						comments={props.comments}
						addComment={props.addComment}
						campsiteId={props.campsite.id}
					/>
				</div>
			</div>
		);
	}
	return <div></div>;
}

export default CampsiteInfo;